FROM node:alpine

ENV NODE_ENV=development

RUN npm install -g yarn && \
npm config set bin-links false && \
yarn config set bin-links false

WORKDIR /etc/src/app

VOLUME /etc/src/app

EXPOSE 8080

CMD npm start
