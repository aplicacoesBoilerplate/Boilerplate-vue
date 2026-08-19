#!/bin/sh

# A linha acima é um shebang que faz forçar shell interpretável

json_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

api_url="$(json_escape "${VITE_API_URL:-}")"
domain_email="$(json_escape "${VITE_DOMAIN_EMAIL:-}")"
google_client_id="$(json_escape "${VITE_GOOGLE_CLIENT_ID:-}")"

cat <<EOF > /usr/share/nginx/html/env.js
window.env = {
  VITE_API_URL: "${api_url}",
  VITE_DOMAIN_EMAIL: "${domain_email}",
  VITE_GOOGLE_CLIENT_ID: "${google_client_id}"
};
EOF

exec "$@"
