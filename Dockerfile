FROM node:10.16.0-alpine
# patch-package requires git
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
CMD [ "yarn", "start" ]
