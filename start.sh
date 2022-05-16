

OF_API_URL=https://api.sandbox.openfabric.co
OF_AUTH_URL=https://auth.sandbox.openfabric.co/oauth2/token
OF_ISSUER_URL=https://issuer.sandbox.openfabric.co
ACCOUNT_SERVER_URL=http://account-integration-sample:3001
MERCHANT_SERVER_URL=http://merchant-integration-sample:3000
ENV=sandbox
SKIP_PROXY=0
function networkDown() {
    docker-compose down --rmi local
    # docker-compose down
}

function variablesUpdate() {
    currentEnv=$(grep 'ENV' .env |  tr '\n' '\0')
    CURRENT_ENV=${currentEnv#*=}

    if [ "$CURRENT_ENV" == "dev" ]; then 
        OF_API_URL=https://api.dev.openfabric.co
        OF_AUTH_URL=https://auth.dev.openfabric.co/oauth2/token
        OF_ISSUER_URL=https://issuer.dev.openfabric.co
        ENV=$CURRENT_ENV
    fi
    export OF_API_URL=$OF_API_URL
    export OF_AUTH_URL=$OF_AUTH_URL
    export OF_ISSUER_URL=$OF_ISSUER_URL
    export ENV=$ENV
    export ACCOUNT_SERVER_URL=$ACCOUNT_SERVER_URL
    export MERCHANT_SERVER_URL=$MERCHANT_SERVER_URL
}

function proxyAccountServer() {
    URL=$(curl -s $(docker port ngrok-account-server 4040)/api/tunnels/command_line | jq -r '.public_url')
    URL+="/api/orchestrated/transactions"
    
    accountClientId=$(grep 'ACCOUNT_CLIENT_ID' .env |  tr '\n' '\0')
    ACCOUNT_CLIENT_ID=${accountClientId#*=}
    
    accountClientSecret=$(grep 'ACCOUNT_CLIENT_SECRET' .env |  tr '\n' '\0')
    ACCOUNT_CLIENT_SECRET=${accountClientSecret#*=}
    
    BASE_64=$(echo $ACCOUNT_CLIENT_ID:$ACCOUNT_CLIENT_SECRET | tr -d '\n' | base64 | tr -d '\n')
    #get account access token
    ACCESSTOKEN=$(curl -s --location --request POST $OF_AUTH_URL \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --header "Authorization: Basic $BASE_64" \
    --data-urlencode 'grant_type=client_credentials' | jq -r '.access_token')
    
    # update account endpoint
    # echo
    # echo "================================ Publish Sample Account Endpoint ================================"
    # echo "Call API: PUT $OF_API_URL/a/settings to update account_transaction_url:$URL "
    # echo
    # UPDATE_RESULT=$(curl -s --location --request PUT $OF_API_URL/a/settings \
    #     --header "Authorization: Bearer $ACCESSTOKEN" \
    #     --header 'Content-Type: application/json' \
    #     --data-raw '{
    # "account_transaction_url": "'$URL'",
    # "auth_config": {"method": "X-API-KEY", "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"}
    # }' | jq -r '.account_transaction_url')

    # echo
    # echo "Sample account endpoint: "$UPDATE_RESULT
    # echo

    echo "================================ Update Merchant Webhook Config ================================"
    merchantClientId=$(grep 'MERCHANT_CLIENT_ID' .env |  tr '\n' '\0')
    MERCHANT_CLIENT_ID=${merchantClientId#*=}
    
    merchantClientSecret=$(grep 'MERCHANT_CLIENT_SECRET' .env |  tr '\n' '\0')
    MERCHANT_CLIENT_SECRET=${merchantClientSecret#*=}

    paymentMethods=$(grep 'PAYMENT_METHODS' .env |  tr '\n' '\0')
    PAYMENT_METHODS=${paymentMethods#*=}

    MERCHANT_BASE_64=$(echo $MERCHANT_CLIENT_ID:$MERCHANT_CLIENT_SECRET | tr -d '\n' | base64 | tr -d '\n')

    MERCHANT_WEBHOOK_URL=$(curl -s $(docker port ngrok-merchant-server 4040)/api/tunnels/command_line | jq -r '.public_url')
    echo "MERCHANT_WEBHOOK_URL ${MERCHANT_WEBHOOK_URL}"
    MERCHANT_WEBHOOK_URL+="/api/orchestrated/webhook"

    #get merchant access token
    MERCHANT_ACCESSTOKEN=$(curl -s --location --request POST $OF_AUTH_URL \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --header "Authorization: Basic $MERCHANT_BASE_64" \
    --data-urlencode 'grant_type=client_credentials' | jq -r '.access_token')
    echo
    MERCHANT_METADATA=$(curl -s --location --request GET $OF_API_URL/m/auth/metadata?payment_methods=$PAYMENT_METHODS \
        --header "Authorization: Bearer $MERCHANT_ACCESSTOKEN" \
        --header 'Content-Type: application/json' | jq -r '.[0]')
    echo "MERCHANT_METADATA ${MERCHANT_METADATA}"

    ACCOUNT_MERCHANT_ID=$(echo $MERCHANT_METADATA | jq -r '.account_merchant_id')
    ACCOUNT_ID=$(echo $MERCHANT_METADATA | jq -r '.account_id')

    echo "ACCOUNT_MERCHANT_ID ${ACCOUNT_MERCHANT_ID}"
    echo "ACCOUNT_ID ${ACCOUNT_ID}"

    MERCHANT_API_CREDENTIAL=$(curl -s --location --request GET $OF_API_URL/a/merchants/api-credentials?account_merchant_id=$ACCOUNT_MERCHANT_ID \
        --header "Authorization: Bearer $ACCESSTOKEN" \
        --header 'Content-Type: application/json')
    echo "MERCHANT_API_CREDENTIAL ${MERCHANT_API_CREDENTIAL}"
    MERCHANT_ID=$(echo $MERCHANT_API_CREDENTIAL | jq -r '.merchant_id')

    echo "MERCHANT_ID ${MERCHANT_ID}"
    
    CREATE_MERCHANT_WEBHOOK=$(curl -s --location --request POST $OF_API_URL/n/subscriptions \
            --header "Authorization: Bearer $ACCESSTOKEN" \
            --header 'Content-Type: application/json' \
            --data-raw '{
                "type": "webhook",
                "merchant_id": "'$MERCHANT_ID'",
                "subscribed_events": [
                    "*"
                ],
                "config": {
                    "url": "'$MERCHANT_WEBHOOK_URL'",
                    "authConfig": {
                        "header": "X-API-Key",
                        "value": "HxMrzQBFbaDeLkUar87nczWNi"
                    }
                }
            }')


   echo "CREATE_MERCHANT_WEBHOOK ${CREATE_MERCHANT_WEBHOOK}"
    

}

printHelp() {

  echo "Usage: start.sh --s"
  echo
  echo "--s :skip proxy local sample account server"
  echo
}

function networkUp() {
    variablesUpdate
    networkDown
    
    docker-compose up --force-recreate -d 2>&1
    if [ $? -ne 0 ]; then
        echo "ERROR !!!! Unable to start network"
        exit 1
    fi
    
    sleep 1
    echo "Sleeping 3s to allow ngrok docker to complete booting"
    sleep 2
    echo
    echo " ____    _____      _      ____    _____ "
    echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
    echo "\___ \    | |     / _ \   | |_) |   | |  "
    echo " ___) |   | |    / ___ \  |  _ <    | |  "
    echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
    echo
    if [ $SKIP_PROXY == 0 ] ; then
        proxyAccountServer
    fi
    echo
    echo "============================================= ALL GOOD ============================================="
    echo
    echo "Open http://localhost:3000 on your browser"
    echo
}

while getopts "s?" opt; do
  case $opt in
    s|\?)
      SKIP_PROXY=1
      echo $SKIP_PROXY
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done

networkUp
