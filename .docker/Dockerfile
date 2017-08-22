FROM nginx:alpine

MAINTAINER See Chuen Hong

VOLUME ["/var/cache/nginx", "/var/log/nginx"]

COPY ./.docker/config/nginx.conf /etc/nginx/nginx.conf

COPY ./dist /var/www/html

EXPOSE 80

ENTRYPOINT nginx

CMD -g "daemon off;"
