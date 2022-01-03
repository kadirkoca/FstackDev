FROM node:16

WORKDIR /back
COPY package*.json ./
RUN npm install
COPY . .
CMD npm run start