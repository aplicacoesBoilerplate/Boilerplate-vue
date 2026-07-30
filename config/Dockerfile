# Stage 1 - Build com Node
FROM node:22.12 AS build-stage 
LABEL maintainer="Gerson f. Ribeiro"

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 - Nginx com suporte a env.js
FROM nginx:stable-alpine AS production-stage

# 1. Crie o grupo e o usuário primeiro
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 2. Copie os arquivos da aplicação e o entrypoint
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY config/entrypoint.sh /entrypoint.sh

# Executa entrypoint antes de iniciar nginx
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
