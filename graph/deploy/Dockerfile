FROM node:12

WORKDIR /usr/src/app

# will copy only .prisma from node_modules
# because everything else is ignored in .dockerignore
COPY node_modules ./

COPY graph/deploy/package.json ./
COPY graph/prisma ./
COPY yarn.lock ./
RUN npm install

COPY dist ./dist

#RUN ls -al

EXPOSE 80

CMD ["node", "dist/graph/main.js"]