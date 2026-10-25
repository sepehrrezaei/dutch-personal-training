#!/bin/sh
# Sets the site password for the GitHub Pages build. Only a SHA-256 hash is stored (as a repo secret).
# Usage: sh scripts/set-password.sh
printf 'New Tegel password: '
stty -echo; read -r PW; stty echo; echo
HASH=$(printf 'tegel:%s' "$PW" | shasum -a 256 | cut -d' ' -f1)
gh secret set APP_PASSWORD_HASH --body "$HASH" && gh workflow run deploy.yml && echo "Saved. The site redeploys in about a minute."
