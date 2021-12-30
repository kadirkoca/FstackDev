FROM node:16

WORKDIR /usr/src/back
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
CMD npm start