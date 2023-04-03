#!/bin/bash

set -e

# deploy nginx
docker build --fail-fast ./nginx/ -t samples-nginx:latest

# deploy Open Fabric home page
docker build --fail-fast ./home-sample/ -t samples-merchant-home:latest

# deploy sdk-card-sample
docker build --fail-fast ./sdk-card-sample/ \
  -t samples-merchant-sdk-card:latest \
  --build-arg ENV=$ENV \
  --build-arg OF_AUTH_URL=${OF_AUTH_URL} \
  --build-arg MERCHANT_CLIENT_ID=${MERCHANT_CLIENT_ID} \
  --build-arg MERCHANT_CLIENT_SECRET=${MERCHANT_CLIENT_SECRET} \
  --build-arg BASIC_AUTH_CREDENTIALS=${BASIC_AUTH_CREDENTIALS} \
  --build-arg OF_ISSUER_URL=${OF_ISSUER_URL}

# deploy sdk-pg-tokenization-sample
docker build --fail-fast ./sdk-pg-tokenization-sample/ \
  -t samples-merchant-sdk-pg-tokenization:latest \
  --build-arg ENV=$ENV \
  --build-arg OF_AUTH_URL=${OF_AUTH_URL} \
  --build-arg MERCHANT_CLIENT_ID=${MERCHANT_CLIENT_ID} \
  --build-arg MERCHANT_CLIENT_SECRET=${MERCHANT_CLIENT_SECRET} \
  --build-arg BASIC_AUTH_CREDENTIALS=${BASIC_AUTH_CREDENTIALS} \
  --build-arg PAYMENT_GATEWAY_NAME=${PAYMENT_GATEWAY_NAME} \
  --build-arg PAYMENT_GATEWAY_PUBLISH_KEY=${PAYMENT_GATEWAY_PUBLISH_KEY}

# deploy sdk-pg-charge-sample
docker build --fail-fast ./sdk-pg-charge-sample/ \
  -t samples-merchant-sdk-pg-charge:latest \
  --build-arg ENV=$ENV \
  --build-arg OF_AUTH_URL=${OF_AUTH_URL} \
  --build-arg MERCHANT_CLIENT_ID=${MERCHANT_CLIENT_ID} \
  --build-arg MERCHANT_CLIENT_SECRET=${MERCHANT_CLIENT_SECRET} \
  --build-arg BASIC_AUTH_CREDENTIALS=${BASIC_AUTH_CREDENTIALS} \
  --build-arg PAYMENT_GATEWAY_NAME=${PAYMENT_GATEWAY_NAME}

# deploy ingenico-sample
docker build --fail-fast ./ingenico-sample/ \
  -t samples-ingenico:latest \
  --build-arg ENV=$ENV \
  --build-arg OF_INGENICO_TRANSACTIONS_URL=${OF_INGENICO_TRANSACTIONS_URL} \
  --build-arg INGENICO_SERVICE_IMPLEMENTATION_ID=${INGENICO_SERVICE_IMPLEMENTATION_ID} \
  --build-arg INGENICO_ORGANIZATION_ID=${INGENICO_ORGANIZATION_ID} \
  --build-arg INGENICO_MERCHANT_ID=${INGENICO_MERCHANT_ID} \
  --build-arg INGENICO_STORE_ID=${INGENICO_STORE_ID}

# deploy sdk-pat-sample
docker build --fail-fast ./pat-link-sample/ \
  -t samples-merchant-pat-link:latest \
  --build-arg ENV=$ENV \
  --build-arg OF_AUTH_URL=${OF_AUTH_URL} \
  --build-arg OF_API_URL=${OF_API_URL} \
  --build-arg MERCHANT_CLIENT_ID=${MERCHANT_CLIENT_ID} \
  --build-arg MERCHANT_CLIENT_SECRET=${MERCHANT_CLIENT_SECRET} \

docker build --fail-fast ./account-integration-sample/ -t samples-account:latest

docker images
