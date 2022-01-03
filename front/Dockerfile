FROM node:16-alpine as client-build
WORKDIR /usr/app/
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Setup the server
FROM nginx
COPY ../nginx/nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/app/
COPY --from=client-build /usr/app/build/ .

EXPOSE 80