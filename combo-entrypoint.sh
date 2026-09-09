#!/bin/sh
set -e

WEBROOT="/usr/share/nginx/html"
SERVER_PORT="${SAMPO_UI_SERVER_PORT:-3001}"

# Default for combo mode: both services are local.
# Override with -e API_URL=https://... if the API is external.
: "${API_URL:=http://localhost:${SERVER_PORT}/api/v1}"

echo "Starting Express server on port ${SERVER_PORT}..."
node /app/server/dist/index.js &
SERVER_PID=$!

echo "Waiting for Express server to be healthy..."
MAX_RETRIES=30
RETRY=0
until wget -q --spider "http://localhost:${SERVER_PORT}/health" 2>/dev/null; do
  RETRY=$((RETRY + 1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "ERROR: Express server did not become healthy after ${MAX_RETRIES} attempts."
    kill "$SERVER_PID" 2>/dev/null
    exit 1
  fi
  echo "  Attempt ${RETRY}/${MAX_RETRIES} -- retrying in 2s..."
  sleep 2
done
echo "Express server is healthy."

fetch_if_exists() {
  URL="$1"
  if wget -q --spider "$URL" 2>/dev/null; then
    wget -qO- "$URL"
  fi
}

patch_index_html() {
  CUSTOM=$(fetch_if_exists "$API_URL/configs/index.html")
  [ -z "$CUSTOM" ] && return
  echo "Patching index.html from $API_URL/configs/index.html..."
  CUSTOM_HEAD=$(echo "$CUSTOM" | awk '/<head>/{found=1} found{print} /<\/title>/{exit}')
  sed -i 's|<head>|\n<head>\n|g' "$WEBROOT/index.html"
  sed -i 's|</title>|\n</title>\n|g' "$WEBROOT/index.html"
  awk -v new_head="$CUSTOM_HEAD" '
    /<head>/    { in_head=1; print new_head; next }
    /<\/title>/ { in_head=0; next }
    in_head     { next }
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
SAMPO_UI_SERVER_PORT=${SAMPO_UI_SERVER_PORT:-3001} \
  envsubst '$SAMPO_UI_CLIENT_PORT $SAMPO_UI_SERVER_PORT' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/http.d/default.conf

echo "Starting nginx..."
exec nginx -g "daemon off;"
