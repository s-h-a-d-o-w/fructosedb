FROM mhart/alpine-node:8
# We store all our files in /usr/src to perform the build
WORKDIR /usr/src

RUN apk add --no-cache --update \
    curl \
    python \
    build-base \
    libexecinfo-dev \
    libc6-compat

# We first add only the files required for installing deps
# If package.json or yarn.lock don't change, no need to re-install later
COPY package.json yarn.lock ./
# We install our deps
RUN yarn
# We copy all source files
COPY . .

ENV LD_LIBRARY_PATH /usr/src/node_modules/appmetrics
ENV BACKEND_URL https://fructosedb.now.sh
ENV NODE_ENV production

# We run the build and expose as /public
RUN yarn build

EXPOSE 443
CMD ["npm", "start"]
