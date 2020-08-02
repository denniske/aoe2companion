FROM node:12

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install
RUN npm run build

COPY ./dist .

EXPOSE 4000

CMD ["node", "server.js"]