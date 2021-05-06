# fixed version because of https://github.com/nodejs/node/issues/35582 in function controller
FROM node:12.18.4

WORKDIR /usr/src/app

# will copy only .prisma from node_modules
# because everything else is ignored in .dockerignore
# COPY node_modules/.prisma ./node_modules/.prisma

COPY graph/deploy/package.json ./
COPY graph/prisma ./
COPY yarn.lock ./
RUN yarn
RUN yarn run generate:prisma

COPY dist ./dist
COPY graph/graphql ./graph/graphql

#RUN ls -al

EXPOSE 80

CMD ["node", "dist/graph/main.js"]
