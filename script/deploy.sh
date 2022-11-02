#!/bin/sh

accountClientId=$(grep 'ACCOUNT_CLIENT_ID' .env |  tr '\n' '\0')
ACCOUNT_CLIENT_ID=${accountClientId#*=}

accountClientSecret=$(grep 'ACCOUNT_CLIENT_SECRET' .env |  tr '\n' '\0')
ACCOUNT_CLIENT_SECRET=${accountClientSecret#*=}

merchantClientId=$(grep 'MERCHANT_CLIENT_ID' .env |  tr '\n' '\0')
MERCHANT_CLIENT_ID=${merchantClientId#*=}

merchantClientSecret=$(grep 'MERCHANT_CLIENT_SECRET' .env |  tr '\n' '\0')
MERCHANT_CLIENT_SECRET=${merchantClientSecret#*=}

paymentGatewayPublishKey=$(grep 'PAYMENT_GATEWAY_PUBLISH_KEY' .env |  tr '\n' '\0')
PAYMENT_GATEWAY_PUBLISH_KEY=${paymentGatewayPublishKey#*=}

paymentGatewayName=$(grep 'PAYMENT_GATEWAY_NAME' .env |  tr '\n' '\0')
PAYMENT_GATEWAY_NAME=${paymentGatewayName#*=}

env=$(grep 'ENV' .env |  tr '\n' '\0')
ENV=${env#*=}

merchantServerUrl=$(grep 'MERCHANT_SERVER_URL' .env |  tr '\n' '\0')
MERCHANT_SERVER_URL=${merchantServerUrl#*=}

ofIssuerUrl=$(grep 'OF_ISSUER_URL' .env |  tr '\n' '\0')
OF_ISSUER_URL=${ofIssuerUrl#*=}

ofAuthUrl=$(grep 'OF_AUTH_URL' .env |  tr '\n' '\0')
OF_AUTH_URL=${ofAuthUrl#*=}

ofAPIUrl=$(grep 'OF_API_URL' .env |  tr '\n' '\0')
OF_API_URL=${ofAPIUrl#*=}

accountServerUrl=$(grep 'ACCOUNT_SERVER_URL' .env |  tr '\n' '\0')
ACCOUNT_SERVER_URL=${accountServerUrl#*=}

# build image
docker build ./nginx/ -t openfabric-integration-samples-nginx:latest
docker build ./merchant-integration-sample/ \
  -t openfabric-integration-samples-merchant:latest \
  --build-arg ACCOUNT_CLIENT_ID=$ACCOUNT_CLIENT_ID \
  --build-arg ACCOUNT_CLIENT_SECRET=$ACCOUNT_CLIENT_SECRET \
  --build-arg MERCHANT_CLIENT_ID=$MERCHANT_CLIENT_ID \
  --build-arg MERCHANT_CLIENT_SECRET=$MERCHANT_CLIENT_SECRET \
  --build-arg PAYMENT_GATEWAY_PUBLISH_KEY=$PAYMENT_GATEWAY_PUBLISH_KEY \
  --build-arg PAYMENT_GATEWAY_NAME=$PAYMENT_GATEWAY_NAME \
  --build-arg ENV=$ENV \
  --build-arg MERCHANT_SERVER_URL=$MERCHANT_SERVER_URL \
  --build-arg OF_ISSUER_URL=$OF_ISSUER_URL \
  --build-arg OF_AUTH_URL=$OF_AUTH_URL \
  --build-arg OF_API_URL=$OF_API_URL \
  --build-arg ACCOUNT_SERVER_URL=$ACCOUNT_SERVER_URL
docker build ./account-integration-sample/ -t openfabric-integration-samples-account:latest

# REGEX to separate image name after deploy
REGEX='Refer to this image as \"(.*)\" in deployments.'

# push images to aws lightsail and parse image name
for name in "NGINX" "MERCHANT" "ACCOUNT"
do
  echo "push $name"
  lower_case_name=$(echo "${name}" | tr '[:upper:]' '[:lower:]')

  DESCRIPTION=$(aws lightsail push-container-image --region ap-southeast-1 --service-name account-merchant-sample --label openfabric-integration-samples-${lower_case_name} --image openfabric-integration-samples-${lower_case_name}:latest)

  if [[ $DESCRIPTION =~ $REGEX ]]
  then
    IMAGE_NAME="${BASH_REMATCH[1]}"
  fi
  echo "Nginx image name: $IMAGE_NAME"

  export $name"_IMAGE_NAME"="$IMAGE_NAME"
done

envsubst '$NGINX_IMAGE_NAME,$MERCHANT_IMAGE_NAME,$ACCOUNT_IMAGE_NAME' < ./script/deploy-template.json > "containers.json"

aws lightsail create-container-service-deployment --region ap-southeast-1 --cli-input-json file://containers.json
