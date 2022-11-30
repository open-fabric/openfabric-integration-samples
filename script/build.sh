#!/bin/bash

# deploy nginx
docker build ./nginx/ -t samples-nginx:latest

# deploy Open Fabric home page
docker build ./home-sample/ -t samples-merchant-home:latest

# deploy sdk-card-sample
docker build ./sdk-card-sample/ \
  -t samples-merchant-sdk-card:latest \
  --build-arg ENV=$ENV \
  --build-arg OF_AUTH_URL=${OF_AUTH_URL} \
  --build-arg MERCHANT_CLIENT_ID=${MERCHANT_CLIENT_ID} \
  --build-arg MERCHANT_CLIENT_SECRET=${MERCHANT_CLIENT_SECRET} \  
  --build-arg BASIC_AUTH_CREDENTIALS=${BASIC_AUTH_CREDENTIALS} \
  --build-arg OF_ISSUER_URL=${OF_ISSUER_URL}

# deploy sdk-pg-tokenization-sample
docker build ./sdk-pg-tokenization-sample/ \
  -t samples-merchant-sdk-pg-tokenization:latest \
  --build-arg ENV=$ENV \
  --build-arg OF_AUTH_URL=${OF_AUTH_URL} \
  --build-arg MERCHANT_CLIENT_ID=${MERCHANT_CLIENT_ID} \
  --build-arg MERCHANT_CLIENT_SECRET=${MERCHANT_CLIENT_SECRET} \  
  --build-arg BASIC_AUTH_CREDENTIALS=${BASIC_AUTH_CREDENTIALS} \
  --build-arg PAYMENT_GATEWAY_NAME=${PAYMENT_GATEWAY_NAME} \
  --build-arg PAYMENT_GATEWAY_PUBLISH_KEY=${PAYMENT_GATEWAY_PUBLISH_KEY}

# deploy sdk-pg-charge-sample
docker build ./sdk-pg-charge-sample/ \
  -t samples-merchant-sdk-pg-charge:latest \
  --build-arg ENV=$ENV \
  --build-arg OF_AUTH_URL=${OF_AUTH_URL} \
  --build-arg MERCHANT_CLIENT_ID=${MERCHANT_CLIENT_ID} \
  --build-arg MERCHANT_CLIENT_SECRET=${MERCHANT_CLIENT_SECRET} \  
  --build-arg BASIC_AUTH_CREDENTIALS=${BASIC_AUTH_CREDENTIALS} \
  --build-arg PAYMENT_GATEWAY_NAME=${PAYMENT_GATEWAY_NAME}

docker build ./account-integration-sample/ -t samples-account:latest

docker images