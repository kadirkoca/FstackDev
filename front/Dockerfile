#FROM node:16 as builder
#WORKDIR /usr/src/front
#COPY package*.json ./
#RUN npm install
#COPY . .
#ARG API_URL
#ENV API_URL=$API_URL
#RUN npm run build
#FROM nginx
#COPY --from=builder /usr/src/front/build /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/conf.d/
#EXPOSE 8080
#CMD ["nginx", "-g", "daemon off;"]

FROM node:16

WORKDIR /usr/src/front
COPY package*.json ./
RUN npm install
COPY . .
CMD npm start