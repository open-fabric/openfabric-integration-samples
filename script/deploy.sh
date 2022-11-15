#!/bin/bash

# REGEX to separate image name after deploy
REGEX='Refer to this image as \"(.*)\" in deployments'

echo "AWS_DEFAULT_REGION: ${AWS_DEFAULT_REGION}"
echo "CONTAINER_SERVICE_NAME: ${CONTAINER_SERVICE_NAME}"
echo "MERCHANT_SERVER_URL: ${MERCHANT_SERVER_URL}"
echo "ACCOUNT_SERVER_URL: ${ACCOUNT_SERVER_URL}"

# push images to aws lightsail and parse image name
for name in "NGINX" "MERCHANT" "ACCOUNT"
do
  echo "push $name"
  lower_case_name=$(echo "${name}" | tr '[:upper:]' '[:lower:]')
  echo $lower_case_name

  DESCRIPTION=$(aws lightsail push-container-image --region ${AWS_DEFAULT_REGION} --service-name ${CONTAINER_SERVICE_NAME} --label openfabric-integration-samples-${lower_case_name} --image openfabric-integration-samples-${lower_case_name}:latest)
  echo $DESCRIPTION

  if [[ $DESCRIPTION =~ $REGEX ]]
  then
    IMAGE_NAME="${BASH_REMATCH[1]}"
  fi
  echo "Image name: $IMAGE_NAME"

  export $name"_IMAGE_NAME"="$IMAGE_NAME"
done

envsubst '$NGINX_IMAGE_NAME,$MERCHANT_IMAGE_NAME,$ACCOUNT_IMAGE_NAME,$CONTAINER_SERVICE_NAME,$MERCHANT_SERVER_URL,$ACCOUNT_SERVER_URL,$ACCOUNT_CLIENT_ID,$ACCOUNT_CLIENT_SECRET' < ./script/deploy-template.json > "containers.json"

aws lightsail create-container-service-deployment --region ${AWS_DEFAULT_REGION} --cli-input-json file://containers.json
