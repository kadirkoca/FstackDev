FROM node:16

WORKDIR /back
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9000
CMD npm run start