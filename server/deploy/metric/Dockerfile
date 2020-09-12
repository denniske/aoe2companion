FROM node:12

WORKDIR /usr/src/app

#COPY package.json ./
#RUN npm install

COPY . .
RUN ls -al

#RUN npm run build

EXPOSE 80

CMD ["node", "dist/server/src/metric.js"]