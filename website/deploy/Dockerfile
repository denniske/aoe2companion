FROM node:12

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package.website.json /usr/src/app/package.json
COPY yarn.lock /usr/src/app/
RUN yarn

# Copying source files
COPY . /usr/src/app

ENV NEXT_PUBLIC_API_URL=https://graphql.aoe2companion.com/graphql
ENV NEXT_PUBLIC_ENVIRONMENT=production

# Building app
RUN npm run build:website
EXPOSE 80
CMD npm run start:website:prod:80