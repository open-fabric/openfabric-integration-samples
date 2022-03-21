# Base image
FROM node:16.0.0

# Make folder to put our files in
RUN mkdir -p /usr/src/merchant-integration-sample

# Set working directory so that all
# subsequent command runs in this folder
WORKDIR /usr/src/merchant-integration-sample

# Copy package json and install dependencies
COPY package*.json ./
COPY *.js ./
COPY *.json ./
COPY yarn.lock ./
COPY .babelrc ./
COPY .eslintrc.json ./
COPY next.config.js ./
COPY tsconfig.json ./
COPY public ./public
COPY components ./components
COPY controllers ./controllers
COPY db ./db
COPY lib ./lib
COPY pages ./pages
COPY services ./services
COPY styles ./styles
COPY util ./util


# Copy our app
COPY . .

ARG ENV
ARG PAYMENT_GATEWAY_PUBLISH_KEY
ARG PAYMENT_GATEWAY_NAME
ARG PAYMENT_METHODS
ARG OF_AUTH_URL
ARG OF_API_URL
ARG MERCHANT_CLIENT_ID
ARG MERCHANT_CLIENT_SECRET
RUN cat >> .env
RUN echo "NEXT_PUBLIC_ENV=${ENV}" >> ./.env
RUN echo "NEXT_PUBLIC_PAYMENT_GATEWAY_PUBLISH_KEY=${PAYMENT_GATEWAY_PUBLISH_KEY}" >> ./.env
RUN echo "NEXT_PUBLIC_PAYMENT_GATEWAY_NAME=${PAYMENT_GATEWAY_NAME}" >> ./.env
RUN echo "NEXT_PUBLIC_PAYMENT_METHODS=${PAYMENT_METHODS}" >> ./.env
RUN echo "NEXT_PUBLIC_OF_AUTH_URL=${OF_AUTH_URL}" >> ./.env
RUN echo "NEXT_PUBLIC_OF_API_URL=${OF_API_URL}" >> ./.env
RUN echo "NEXT_PUBLIC_MERCHANT_CLIENT_ID=${MERCHANT_CLIENT_ID}" >> ./.env
RUN echo "NEXT_PUBLIC_MERCHANT_CLIENT_SECRET=${MERCHANT_CLIENT_SECRET}" >> ./.env
RUN sed -i -e "s/{PAYMENT_METHODS}/$PAYMENT_METHODS/g" ./public/vanilla.html
RUN sed -i -e "s/{ENV}/$ENV/g" ./public/vanilla.html

RUN yarn install
RUN yarn build
# Expose port to access server
EXPOSE 3000

# Command to run our app
ENTRYPOINT [ "yarn", "start"]
