FROM node:18-alpine AS builder
WORKDIR "/app"
COPY ./app .

RUN yarn install --network-timeout 100000 && yarn cache clean && yarn build
#RUN yarn install && yarn cache clean && yarn build
CMD [ "sh", "-c", "yarn start"]
