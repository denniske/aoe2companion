FROM node:26.13.0-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY yarn.lock ./
COPY .yarnrc.docker.yml ./.yarnrc.yml
COPY .yarn/releases .yarn/releases

RUN echo '{"name":"app","version":"1.0.0"}' > package.json

# Node 25+ no longer ships corepack in the image.
RUN npm install -g corepack@0.36.0
RUN corepack enable && corepack prepare yarn --activate
RUN yarn add expo-server express compression morgan

COPY dist ./dist
COPY server.ts ./server.ts

CMD ["node", "server.ts"]