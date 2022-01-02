FROM node:16

WORKDIR /front
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD npm run start

#FROM nginx
#COPY --from=builder /front/dist /usr/share/nginx/html
#CMD ["nginx", "-g", "daemon off;"]

