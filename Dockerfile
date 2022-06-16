FROM nginx:1.21.0-alpine
COPY . /usr/share/nginx/html/
EXPOSE 80