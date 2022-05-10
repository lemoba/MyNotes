FROM node:18.1.0-alpine

WORKDIR /var/www

COPY . /var/www

RUN npm install -g yarn && yarn install

EXPOSE 8888

ENTRYPOINT ["yarn", "docs:dev"]