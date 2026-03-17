#!/bin/sh
set -e

WEBROOT="/usr/share/nginx/html"

: "${API_URL:?API_URL environment variable is required}"

fetch_if_exists() {
  URL="$1"
  if wget -q --spider "$URL" 2>/dev/null; then
    wget -qO- "$URL"
  fi
}

patch_index_html() {
  CUSTOM=$(fetch_if_exists "$API_URL/configs/index.html")
  [ -z "$CUSTOM" ] && return

  echo "Patching index.html head from $API_URL/configs/index.html..."

  CUSTOM_HEAD=$(echo "$CUSTOM" | awk '/<head>/,/<\/head>/')

  awk -v new_head="$CUSTOM_HEAD" '
    /<head>/  { in_head=1; print new_head; next }
    /<\/head>/{ in_head=0; next }
    in_head   { next }
    { print }
  ' "$WEBROOT/index.html" > /tmp/index.html && mv /tmp/index.html "$WEBROOT/index.html"
}

patch_robots_txt() {
  CUSTOM=$(fetch_if_exists "$API_URL/configs/robots.txt")
  [ -z "$CUSTOM" ] && return

  echo "Replacing robots.txt from $API_URL/configs/robots.txt..."
  echo "$CUSTOM" > "$WEBROOT/robots.txt"
}

patch_index_html
patch_robots_txt

echo "Applying nginx config..."
SAMPO_UI_CLIENT_PORT=${SAMPO_UI_CLIENT_PORT:-80} \
  envsubst '$SAMPO_UI_CLIENT_PORT' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

echo "Starting nginx..."
exec nginx -g "daemon off;"