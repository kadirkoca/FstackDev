FROM ubuntu:latest

USER root

RUN apt-get update
RUN apt-get install -y nginx nodejs

# Remove the default Nginx configuration file
RUN rm -v /etc/nginx/conf.d/default.conf

# Copy a configuration file from the current directory
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

#ADD web /usr/share/nginx/html/
#ADD web /var/www/html/


FROM node:16

WORKDIR /back
COPY package*.json ./
RUN npm install
COPY . .
CMD npm run start