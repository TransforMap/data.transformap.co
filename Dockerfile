FROM node:4-onbuild
COPY docker-entrypoint.sh docker-entrypoint.sh
EXPOSE 5000
CMD ["/usr/src/app/docker-entrypoint.sh"]
