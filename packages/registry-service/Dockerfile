FROM oven/bun:1 AS base
WORKDIR /usr/src/app


FROM base AS release

COPY . .
RUN bun install
EXPOSE 3000

CMD [ "bun", "--watch", "src/router/http/server.ts" ]
