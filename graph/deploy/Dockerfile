# fixed version because of https://github.com/nodejs/node/issues/35582 in function controller
FROM node:16.13.1 as build

WORKDIR /usr/src/app

#COPY /graph ./graph
#COPY graph/prisma ./
#COPY yarn.lock ./

COPY . .
RUN yarn
RUN yarn run generate:prisma
RUN npx nx build graph

ENV PORT=80

EXPOSE 80

CMD ["node", "dist/graph/main.js"]


#FROM node:16.13.1
#
#WORKDIR /usr/src/app
#
#COPY graph/deploy/package.json ./
#COPY graph/prisma ./
#COPY yarn.lock ./
#RUN yarn
#RUN yarn run generate:prisma
#RUN npx nx build graph
#
#COPY --from=build /usr/src/app/dist ./dist
#
#COPY graph/graphql ./graph/graphql
#
##RUN ls -al
#
#EXPOSE 80
#
#CMD ["node", "dist/graph/main.js"]
