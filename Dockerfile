FROM alpine:3.10
LABEL Maintainer="Jabar Digital Service <digital.service@jabarprov.go.id>" \
      Description="Lightweight container with Nginx 1.16 & PHP-FPM 7.4 based on Alpine Linux (forked from trafex/alpine-nginx-php7)."

ADD https://packages.whatwedo.ch/php-alpine.rsa.pub /etc/apk/keys/php-alpine.rsa.pub

RUN apk --update add ca-certificates
RUN echo "https://packages.whatwedo.ch/php-alpine/v3.10/php-7.4" >> /etc/apk/repositories

# Install packages
RUN apk --no-cache add nginx supervisor curl

RUN rm /etc/nginx/conf.d/default.conf

COPY config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN mkdir -p /var/www/html

RUN mkdir -p /usr/share/nginx/html/spa/dist
WORKDIR /usr/share/nginx/html/spa/dist
COPY spa/dist /usr/share/nginx/html/spa/dist

#############################
RUN chown -R nginx.nginx /var/www/html && \
  chown -R nginx.nginx /run && \
  chown -R nginx.nginx /var/lib/nginx && \
  chown -R nginx.nginx /var/log/nginx && \  
  chown -R nginx.nginx /usr/share/nginx

USER root

# Let supervisord start nginx
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
