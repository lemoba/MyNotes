FROM node:14.17.6-alpine3.13

WORKDIR /var/www

COPY . /var/www

RUN yarn install

EXPOSE 80

ENTRYPOINT ["yarn", "docs:dev"]