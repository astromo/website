FROM abiosoft/caddy

ADD dist /var/www
ADD Caddyfile /etc/caddy/

CMD ["--conf", "/etc/caddy/Caddyfile"]
