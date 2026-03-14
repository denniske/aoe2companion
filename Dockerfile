FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases .yarn/releases
COPY .yarn/cache .yarn/cache

RUN corepack enable && corepack prepare yarn --activate
RUN --mount=type=secret,id=FONTAWESOME_NPM_AUTH_TOKEN \
    export FONTAWESOME_NPM_AUTH_TOKEN=$(cat /run/secrets/FONTAWESOME_NPM_AUTH_TOKEN) && \
    yarn

COPY dist ./dist
COPY server.ts ./server.ts

CMD ["node", "server.ts"]