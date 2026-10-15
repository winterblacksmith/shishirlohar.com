"""Copy a verified Orion Quant Lab revision into a portfolio preview or release directory."""
import argparse
import json
from pathlib import Path
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPOSITORY = 'winterblacksmith/quant-lab'
PARTS = ('quant', 'assets/quant', 'assets/atlas-shell')


def read_lock():
    lock = json.loads((ROOT / 'atlas-quant.lock.json').read_text())
    if lock.get('repository') != REPOSITORY or not re.fullmatch(r'[0-9a-f]{40}', lock.get('revision', '')):
        raise ValueError('Orion lock must identify the approved repository and a full commit SHA')
    return lock


def assemble(source, destination, revision):
    actual = subprocess.check_output(['git', '-C', str(source), 'rev-parse', 'HEAD'], text=True).strip()
    if actual != revision:
        raise ValueError(f'Orion revision mismatch: expected {revision}, got {actual}')
    # The only permitted generated modification is the validated data snapshot.
    subprocess.run(['git', '-C', str(source), 'diff', '--exit-code', 'HEAD', '--', '.',
                    ':(exclude)dist/assets/quant/spy.json'], check=True, stdout=subprocess.DEVNULL)
    for part in PARTS:
        directory = source / 'dist' / part
        if not directory.is_dir() or directory.is_symlink() or any(p.is_symlink() for p in directory.rglob('*')):
            raise ValueError(f'Missing or unsafe Orion output: {part}')
        tracked = subprocess.check_output(['git', '-C', str(source), 'ls-files', '--others', '--exclude-standard', '--', f'dist/{part}'], text=True)
        if tracked.strip():
            raise ValueError(f'Untracked files in Orion output: {part}')
    # Validate all inputs before replacing any generated output.
    for part in PARTS:
        target = destination / part
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(source / 'dist' / part, target)
    (destination / 'assets/quant/release.json').write_text(json.dumps({
        'repository': REPOSITORY, 'revision': revision,
    }, indent=2) + '\n')
    print(f'Assembled Orion Quant Lab {revision[:12]} into {destination}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', nargs='?', default='.atlas-source')
    parser.add_argument('--output', default='dist')
    parser.add_argument('--fetch', action='store_true', help='Fetch the pinned revision for local preview')
    args = parser.parse_args()
    lock = read_lock()
    source = (ROOT / args.source).resolve()
    if args.fetch:
        url = f'https://github.com/{REPOSITORY}.git'
        if not source.exists():
            subprocess.run(['git', 'clone', '--no-checkout', url, str(source)], check=True)
        origin = subprocess.check_output(['git', '-C', str(source), 'remote', 'get-url', 'origin'], text=True).strip()
        if origin != url:
            raise ValueError('Unexpected Orion checkout origin')
        # A new --no-checkout clone has an empty index; only inspect existing worktrees.
        if (source / 'package.json').exists():
            status = subprocess.check_output(['git', '-C', str(source), 'status', '--porcelain'], text=True)
            if status.strip():
                raise ValueError('Orion source has local changes; preserve them before syncing')
        subprocess.run(['git', '-C', str(source), 'fetch', '--depth=1', 'origin', lock['revision']], check=True)
        subprocess.run(['git', '-C', str(source), 'checkout', '--detach', lock['revision']], check=True)
    assemble(source, (ROOT / args.output).resolve(), lock['revision'])


if __name__ == '__main__':
    main()
