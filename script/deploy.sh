#!/bin/bash

# REGEX to separate image name after deploy
REGEX='Refer to this image as \"(.*)\" in deployments'

echo "AWS_DEFAULT_REGION: ${AWS_DEFAULT_REGION}"
echo "CONTAINER_SERVICE_NAME: ${CONTAINER_SERVICE_NAME}"
echo "MERCHANT_SERVER_URL: ${MERCHANT_SERVER_URL}"
echo "ACCOUNT_SERVER_URL: ${ACCOUNT_SERVER_URL}"

# push images to aws lightsail and parse image name
for name in "NGINX" "MERCHANT-HOME" "MERCHANT-SDK-PG-TOKENIZATION" "MERCHANT-SDK-PG-CHARGE" "MERCHANT-SDK-CARD" "ACCOUNT"
do
  echo "push $name"
  lower_case_name=$(echo "${name}" | tr '[:upper:]' '[:lower:]')
  echo "lower case name: $lower_case_name"

  DESCRIPTION=$(aws lightsail push-container-image --region ${AWS_DEFAULT_REGION} --service-name ${CONTAINER_SERVICE_NAME} --label samples-${lower_case_name} --image samples-${lower_case_name}:latest)
  echo $DESCRIPTION

  if [[ $DESCRIPTION =~ $REGEX ]]
  then
    IMAGE_NAME="${BASH_REMATCH[1]}"
  fi
  echo "Image name: $IMAGE_NAME"

  NEW_NAME=$(echo "$name" | tr '-' '_')
  echo "new name: $NEW_NAME"
  export $NEW_NAME"_IMAGE_NAME"="$IMAGE_NAME"
done

envsubst '$NGINX_IMAGE_NAME,$MERCHANT_HOME_IMAGE_NAME,$MERCHANT_SDK_PG_TOKENIZATION_IMAGE_NAME,$MERCHANT_SDK_PG_CHARGE_IMAGE_NAME,$MERCHANT_SDK_CARD_IMAGE_NAME,$ACCOUNT_IMAGE_NAME,$CONTAINER_SERVICE_NAME,$MERCHANT_SERVER_URL,$ACCOUNT_SERVER_URL,$ACCOUNT_CLIENT_ID,$ACCOUNT_CLIENT_SECRET,$OF_AUTH_URL,$OF_ISSUER_URL,$OF_API_URL,$BASIC_AUTH_CREDENTIALS,$SESSION_SECRET' < ./script/deploy-template.json > "containers.json"

aws lightsail create-container-service-deployment --region ${AWS_DEFAULT_REGION} --cli-input-json file://containers.json
