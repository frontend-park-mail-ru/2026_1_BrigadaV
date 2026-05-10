FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx vite build

FROM nginx:mainline-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY server/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443 443/udp
