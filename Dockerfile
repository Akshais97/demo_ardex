FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN npm install --global pnpm@11.7.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 DATA_DIR=/data
COPY --from=build /app/dist ./dist
COPY server ./server
COPY src/domain ./src/domain
COPY src/data ./src/data
COPY config ./config
COPY package.json ./
CMD ["node", "server/index.mjs"]
