# fixed version because of https://github.com/nodejs/node/issues/35582 in function controller
FROM node:16.13.1

#WORKDIR /usr/src/app
#
##COPY /graph ./graph
##COPY graph/prisma ./
##COPY yarn.lock ./
#
#COPY . .
#RUN yarn
#RUN yarn run generate:prisma
#RUN npx nx build graph
#
#ENV PORT=80
#
#EXPOSE 80
#
#CMD ["node", "dist/graph/main.js"]


WORKDIR /usr/src/app

# will copy only .prisma from node_modules
# because everything else is ignored in .dockerignore
#COPY node_modules/.prisma ./node_modules/.prisma

COPY package.json ./
COPY subset.mjs ./
RUN npx node subset.mjs apply server
COPY graph/prisma ./graph/prisma
COPY yarn.lock ./
RUN yarn
RUN yarn run generate:prisma

COPY dist ./dist
COPY graph/graphql ./graph/graphql

#RUN ls -al

#ENV PORT=80
#EXPOSE 80

CMD ["node", "dist/graph/main.js"]
