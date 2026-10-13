#!/usr/bin/env bash
# Deploy tracked portfolio files plus the pinned Atlas release to the existing Casterly Rock Nginx site.
set -euo pipefail
cd "$(dirname "$0")/.."
server="${1:-opc@129.80.109.207}"
if [ -n "$(git status --porcelain -- dist)" ]; then
  echo 'Commit changes in dist/ before deploying.' >&2
  exit 1
fi
staging="$(mktemp -d /tmp/shishir-portfolio.XXXXXX)"
trap 'rm -rf "$staging"' EXIT
mkdir "$staging/site"
git archive --format=tar HEAD:dist | tar -xf - -C "$staging/site"
python3 scripts/assemble-atlas.py "$staging/atlas" --fetch --output "$staging/site"
npm --prefix "$staging/atlas" run refresh:data
npm --prefix "$staging/atlas" run check
python3 scripts/assemble-atlas.py "$staging/atlas" --output "$staging/site"
python3 scripts/version-assets.py "$staging/site"
python3 scripts/check.py "$staging/site"
npm test
archive="$staging/portfolio.tar"
tar -cf "$archive" -C "$staging/site" .
revision="$(python3 -c 'import hashlib,sys; print(hashlib.sha256(open(sys.argv[1], "rb").read()).hexdigest()[:40])' "$archive")"
scp "$archive" "$server:/tmp/shishir-portfolio-release.tar"
ssh "$server" bash -s -- "$revision" <<'REMOTE'
set -euo pipefail
release="/var/www/shishirlohar.com/releases/$1"
sudo mkdir -p "$release"
sudo tar -xf /tmp/shishir-portfolio-release.tar -C "$release"
sudo chmod -R a+rX "$release"
sudo restorecon -RF /var/www/shishirlohar.com
sudo ln -sfn "$release" /var/www/shishirlohar.com/current.next
sudo mv -Tf /var/www/shishirlohar.com/current.next /var/www/shishirlohar.com/current
sudo nginx -t
curl --fail --silent --show-error --resolve shishirlohar.com:443:127.0.0.1 https://shishirlohar.com/health
REMOTE
printf '\nDeployed revision %s.\n' "$revision"
