FROM node:26.13.0-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY yarn.lock ./
COPY .yarnrc.docker.yml ./.yarnrc.yml
COPY .yarn/releases .yarn/releases

RUN echo '{"name":"app","version":"1.0.0"}' > package.json

# The pinned release from .yarn/releases, run directly: node 25+ no longer ships corepack, and this
# needs no yarn download at build time.
RUN node .yarn/releases/yarn-4.17.0.cjs add expo-server express compression morgan

COPY dist ./dist
COPY server.ts ./server.ts

CMD ["node", "server.ts"]