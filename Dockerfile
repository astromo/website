FROM armhfbuild/caddy

COPY dist /var/www
COPY Caddyfile /etc/caddy/

