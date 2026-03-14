FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY yarn.lock ./
COPY .yarnrc.docker.yml ./.yarnrc.yml
COPY .yarn/releases .yarn/releases

RUN echo '{"name":"app","version":"1.0.0"}' > package.json

RUN corepack enable && corepack prepare yarn --activate
RUN yarn add expo-server express compression morgan

COPY dist ./dist
COPY server.ts ./server.ts

CMD ["node", "server.ts"]