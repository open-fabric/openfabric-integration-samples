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
ARG OF_AUTH_URL
ARG MERCHANT_CLIENT_ID
ARG MERCHANT_CLIENT_SECRET
ARG OF_ISSUER_URL
ARG BASIC_AUTH_CREDENTIALS
RUN cat >> .env
RUN echo "NEXT_PUBLIC_ENV=${ENV}" >> ./.env
RUN echo "OF_AUTH_URL=${OF_AUTH_URL}" >> ./.env
RUN echo "MERCHANT_CLIENT_ID=${MERCHANT_CLIENT_ID}" >> ./.env
RUN echo "MERCHANT_CLIENT_SECRET=${MERCHANT_CLIENT_SECRET}" >> ./.env
RUN echo "OF_ISSUER_URL=${OF_ISSUER_URL}" >> ./.env
RUN echo "BASIC_AUTH_CREDENTIALS=${BASIC_AUTH_CREDENTIALS}" >> ./.env

RUN sed -i -e "s/Environment.sandbox/'$ENV'/g" ./public/sdk-card.html

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
RUN sed -i -e "s/Environment.sandbox/'$ENV'/g" ./public/sdk-card.html
RUN chmod 777 ./
USER nextjs
EXPOSE 3003
CMD ["yarn", "start"]
