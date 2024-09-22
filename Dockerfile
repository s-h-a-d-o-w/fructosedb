FROM node:14-alpine
# patch-package requires git
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn
# Building presumably already happened (on travis via test script or in dev environment manually)
COPY . .
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
CMD [ "yarn", "start" ]
