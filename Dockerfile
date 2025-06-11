# Stage 1 - Build com Node
FROM node:22.12 AS build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - Nginx com suporte a env.js
FROM nginx:stable-alpine AS production-stage

# Copia arquivos estáticos gerados
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copia config customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia entrypoint para injetar env.js
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Executa entrypoint antes de iniciar nginx
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
