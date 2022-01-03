FROM node:16 as builder

WORKDIR /front
COPY package*.json ./
RUN npm install
COPY . .
CMD npm run build

FROM nginx
COPY --from=builder /front/dist /usr/share/nginx/html
COPY --from=builder /front/dist /var/www/html
CMD ["nginx", "-g", "daemon off;"]

