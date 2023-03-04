# 1. Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG ENV
ARG OF_INGENICO_TRANSACTIONS_URL
ARG INGENICO_SERVICE_IMPLEMENTATION_ID
ARG INGENICO_ORGANIZATION_ID
ARG INGENICO_MERCHANT_ID
ARG INGENICO_STORE_ID
ARG BASIC_AUTH_CREDENTIALS
RUN cat >> .env
RUN echo "NEXT_PUBLIC_ENV=${ENV}" >> ./.env
RUN echo "OF_INGENICO_TRANSACTIONS_URL=${OF_INGENICO_TRANSACTIONS_URL}" >> ./.env
RUN echo "INGENICO_SERVICE_IMPLEMENTATION_ID=${INGENICO_SERVICE_IMPLEMENTATION_ID}" >> ./.env
RUN echo "INGENICO_ORGANIZATION_ID=${INGENICO_ORGANIZATION_ID}" >> ./.env
RUN echo "INGENICO_MERCHANT_ID=${INGENICO_MERCHANT_ID}" >> ./.env
RUN echo "INGENICO_STORE_ID=${INGENICO_STORE_ID}" >> ./.env
RUN echo "BASIC_AUTH_CREDENTIALS=${BASIC_AUTH_CREDENTIALS}" >> ./.env

RUN sed -i -e "s/Environment.sandbox/'$ENV'/g" ./public/index.html

RUN yarn build

FROM node:16-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1777 -S nodejs
RUN adduser -S nextjs -u 1777
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN sed -i -e "s/Environment.sandbox/'$ENV'/g" ./public/index.html
RUN chmod 777 ./
USER nextjs
EXPOSE 3004
ENV PORT 3004
CMD ["node", "server.js"]
