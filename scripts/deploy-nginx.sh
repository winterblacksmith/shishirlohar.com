#!/usr/bin/env bash
# Deploy the tracked dist/ files to the existing Casterly Rock Nginx site.
set -euo pipefail
cd "$(dirname "$0")/.."
server="${1:-opc@129.80.109.207}"
revision="$(git rev-parse --short HEAD)"
if [ -n "$(git status --porcelain -- dist)" ]; then
  echo 'Commit changes in dist/ before deploying.' >&2
  exit 1
fi
npm run check
archive="$(mktemp /tmp/shishir-portfolio.XXXXXX)"
trap 'rm -f "$archive"' EXIT
git archive --format=tar "HEAD:dist" > "$archive"
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
curl --fail --silent --show-error -H 'Host: shishirlohar.com' http://127.0.0.1/health
REMOTE
printf '\nDeployed revision %s.\n' "$revision"
