FROM node:16 as client-build
WORKDIR /front
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Setup the server
FROM nginx
WORKDIR /front
COPY ../nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=client-build /front/dist/ /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80