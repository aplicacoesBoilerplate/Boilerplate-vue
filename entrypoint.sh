#!/bin/sh

echo "🛠️  Gerando env.js..."

cat <<EOF > /usr/share/nginx/html/env.js
window.env = {
  VITE_API_URL: "${VITE_API_URL}",
  VITE_APP_VERSION: "${VITE_APP_VERSION}"
};
EOF

echo "✅  env.js gerado com sucesso."
exec "$@"
