#!/bin/sh

# A linha acima é um shebang que faz forçar shell interpretável

echo "Gerando env.js..."

cat <<EOF > /usr/share/nginx/html/env.js
window.env = {
  VITE_API_URL: "${VITE_API_URL}",
  VITE_DOMAIN_EMAIL: "${VITE_DOMAIN_EMAIL}"
};
EOF

echo "✅  env.js gerado com sucesso."
exec "$@"
