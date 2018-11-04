FROM xybersolve/xs-zeromq-node-base:latest

MAINTAINER Greg Milligan <xybersolve@gmail.com>

ARG ZMQ_PORT
ARG HTTP_PORT

ENV ZMQ_PORT=${ZMQ_PORT} \
    HTTP_PORT=${HTTP_PORT}

COPY ./ /app
WORKDIR /app

RUN rm -rf node_modules && \
    apt-get update && \
    npm install

EXPOSE $ZMQ_PORT $HTTP_PORT

CMD ["npm", "start"]
