FROM node:20-alpine
WORKDIR /usr/src/app
COPY ./out/ ./out/
COPY server.js .
RUN npm i express@4

EXPOSE 3000
CMD [ "node", "server.js" ]