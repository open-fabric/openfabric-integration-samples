

OF_API_URL=https://api.sandbox.openfabric.co
OF_AUTH_URL=https://auth.sandbox.openfabric.co/oauth2/token
OF_ISSUER_URL=https://issuer.sandbox.openfabric.co
ACCOUNT_SERVER_URL=host.docker.internal:3001
MERCHANT_SERVER_URL=host.docker.internal:3000
ENV=sandbox

function variablesUpdate() {
    basicAuthCredentials=$(grep 'BASIC_AUTH_CREDENTIALS' .env |  tr '\n' '\0')
    BASIC_AUTH_CREDENTIALS=${basicAuthCredentials#*=}
    if [ ! -z "$BASIC_AUTH_CREDENTIALS" ]; then
        export  BASIC_AUTH_CREDENTIALS=$BASIC_AUTH_CREDENTIALS
    fi

    sessionSecret=$(grep 'SESSION_SECRET' .env |  tr '\n' '\0')
    SESSION_SECRET=${sessionSecret#*=}
    if [ ! -z "$SESSION_SECRET" ]; then
        export  SESSION_SECRET=$SESSION_SECRET
    fi

    accountClientId=$(grep 'ACCOUNT_CLIENT_ID' .env |  tr '\n' '\0')
    ACCOUNT_CLIENT_ID=${accountClientId#*=}
    
    accountClientSecret=$(grep 'ACCOUNT_CLIENT_SECRET' .env |  tr '\n' '\0')
    ACCOUNT_CLIENT_SECRET=${accountClientSecret#*=}
    
    merchantClientId=$(grep 'MERCHANT_CLIENT_ID' .env |  tr '\n' '\0')
    MERCHANT_CLIENT_ID=${merchantClientId#*=}
    
    merchantClientSecret=$(grep 'MERCHANT_CLIENT_SECRET' .env |  tr '\n' '\0')
    MERCHANT_CLIENT_SECRET=${merchantClientSecret#*=}

    paymentMethods=$(grep 'PAYMENT_METHODS' .env |  tr '\n' '\0')
    PAYMENT_METHODS=${paymentMethods#*=}

    paymentGatewayPublishKey=$(grep 'PAYMENT_GATEWAY_PUBLISH_KEY' .env |  tr '\n' '\0')
    PAYMENT_GATEWAY_PUBLISH_KEY=${paymentGatewayPublishKey#*=}

    paymentGatewayName=$(grep 'PAYMENT_GATEWAY_NAME' .env |  tr '\n' '\0')
    PAYMENT_GATEWAY_NAME=${paymentGatewayName#*=}

    currentEnv=$(grep 'ENV' .env |  tr '\n' '\0')
    CURRENT_ENV=${currentEnv#*=}
    if [ "$CURRENT_ENV" == "dev" ]; then 
        OF_API_URL=https://api.dev.openfabric.co
        OF_AUTH_URL=https://auth.dev.openfabric.co/oauth2/token
        OF_ISSUER_URL=https://issuer.dev.openfabric.co
        ENV=$CURRENT_ENV
    fi
    if [ "$CURRENT_ENV" == "prod" ]; then 
        OF_API_URL=https://api.openfabric.co
        OF_AUTH_URL=https://auth.openfabric.co/oauth2/token
        OF_ISSUER_URL=https://issuer.openfabric.co
        ENV=$CURRENT_ENV
    fi
    export ACCOUNT_CLIENT_ID=$ACCOUNT_CLIENT_ID
    export ACCOUNT_CLIENT_SECRET=$ACCOUNT_CLIENT_SECRET
    export MERCHANT_CLIENT_ID=$MERCHANT_CLIENT_ID
    export MERCHANT_CLIENT_SECRET=$MERCHANT_CLIENT_SECRET
    export PAYMENT_METHODS=$PAYMENT_METHODS
    export PAYMENT_GATEWAY_PUBLISH_KEY=$PAYMENT_GATEWAY_PUBLISH_KEY
    export PAYMENT_GATEWAY_NAME=$PAYMENT_GATEWAY_NAME
    export OF_API_URL=$OF_API_URL
    export OF_AUTH_URL=$OF_AUTH_URL
    export OF_ISSUER_URL=$OF_ISSUER_URL
    export ENV=$ENV
    export ACCOUNT_SERVER_URL=$ACCOUNT_SERVER_URL
}

function proxyAccountServer() {
    URL="${ACCOUNT_SERVER_URL}/api/orchestrated/transactions"
    export ACCOUNT_TRANSACTION_URL=${URL}
    BASE_64=$(echo $ACCOUNT_CLIENT_ID:$ACCOUNT_CLIENT_SECRET | tr -d '\n' | base64 | tr -d '\n')
    #get account access token
    ACCESSTOKEN=$(curl -s --location --request POST $OF_AUTH_URL \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --header "Authorization: Basic $BASE_64" \
    --data-urlencode 'grant_type=client_credentials' | jq -r '.access_token')
    # update account endpoint
    echo 
    echo "================================ Publish Sample Account Endpoint ================================"
    echo
    UPDATE_RESULT=$(curl --silent --location --request PUT $OF_API_URL/a/settings \
        -H "Authorization: Bearer $ACCESSTOKEN" \
        -H 'Content-Type: application/json' \
        --data-raw '{
    "account_transaction_url": "'$URL'",
    "auth_config": {"method": "X-API-KEY", "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"}
    }' | jq -r '.account_transaction_url')
    echo
    echo "================================"
    echo "Sample account endpoint: "$UPDATE_RESULT
    echo

    echo "================================ Update Merchant Webhook Config ================================"
    merchantClientId=$(grep 'MERCHANT_CLIENT_ID' .env |  tr '\n' '\0')
    MERCHANT_CLIENT_ID=${merchantClientId#*=}
    
    merchantClientSecret=$(grep 'MERCHANT_CLIENT_SECRET' .env |  tr '\n' '\0')
    MERCHANT_CLIENT_SECRET=${merchantClientSecret#*=}

    paymentMethods=$(grep 'PAYMENT_METHODS' .env |  tr '\n' '\0')
    PAYMENT_METHODS=${paymentMethods#*=}

    MERCHANT_BASE_64=$(echo $MERCHANT_CLIENT_ID:$MERCHANT_CLIENT_SECRET | tr -d '\n' | base64 | tr -d '\n')


    MERCHANT_WEBHOOK_URL+="$MERCHANT_SERVER_URL/api/orchestrated/webhook"

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
            }' | jq -r '.config.url')
    echo
    echo "Sample merchant webhook endpoint: "$CREATE_MERCHANT_WEBHOOK
    echo
}

printHelp() {

  echo "Usage: start.sh --s"
  echo
  echo "--s :skip proxy local sample account server"
  echo
}

function networkUp() {
    # HEROKU_MERCHANT_REPO=dev-merchant-sample
    # HEROKU_ACCOUNT_REPO=dev-account-sample

    variablesUpdate
    if [[ $HEROKU_API_KEY == "" ]]; then
        heroku login
    else
        echo "Heroku API key found."
        export HEROKU_API_KEY=$HEROKU_API_KEY
        echo "machine api.heroku.com" > ~/.netrc
        echo "  login $HEROKU_USER_NAME" > ~/.netrc
        echo " password $HEROKU_API_KEY" > ~/.netrc
        heroku auth:whoami
    fi

    MERCHANT_DOMAIN=$(heroku domains --app ${HEROKU_MERCHANT_REPO} -j | jq -r '.[0].hostname')
    echo "MERCHANT_DOMAIN ${MERCHANT_DOMAIN}"
    export MERCHANT_SERVER_URL=https://${MERCHANT_DOMAIN}

    ACCOUNT_DOMAIN=$(heroku domains --app ${HEROKU_ACCOUNT_REPO} -j | jq -r '.[0].hostname')
    echo "ACCOUNT_DOMAIN ${ACCOUNT_DOMAIN}"
    export ACCOUNT_SERVER_URL=https://${ACCOUNT_DOMAIN}
        
    heroku container:login
    cd merchant-integration-sample
    heroku stack:set container -a ${HEROKU_MERCHANT_REPO}

    heroku container:push web -a ${HEROKU_MERCHANT_REPO} \
    --arg PAYMENT_GATEWAY_PUBLISH_KEY=${PAYMENT_GATEWAY_PUBLISH_KEY},PAYMENT_GATEWAY_NAME=${PAYMENT_GATEWAY_NAME},PAYMENT_METHODS=${PAYMENT_METHODS},ENV=${ENV},OF_AUTH_URL=${OF_AUTH_URL},OF_API_URL=${OF_API_URL},MERCHANT_CLIENT_ID=${MERCHANT_CLIENT_ID},MERCHANT_CLIENT_SECRET=${MERCHANT_CLIENT_SECRET},OF_ISSUER_URL=${OF_ISSUER_URL},ACCOUNT_SERVER_URL=${ACCOUNT_SERVER_URL}
    heroku config:set --app ${HEROKU_MERCHANT_REPO} PAYMENT_GATEWAY_PUBLISH_KEY=${PAYMENT_GATEWAY_PUBLISH_KEY} PAYMENT_GATEWAY_NAME=${PAYMENT_GATEWAY_NAME} PAYMENT_METHODS=${PAYMENT_METHODS} ENV=${ENV} OF_AUTH_URL=${OF_AUTH_URL} OF_API_URL=${OF_API_URL} MERCHANT_CLIENT_ID=${MERCHANT_CLIENT_ID} MERCHANT_CLIENT_SECRET=${MERCHANT_CLIENT_SECRET} OF_ISSUER_URL=${OF_ISSUER_URL} ACCOUNT_SERVER_URL=${ACCOUNT_SERVER_URL} BASIC_AUTH_CREDENTIALS=${BASIC_AUTH_CREDENTIALS}
    heroku container:release web -a ${HEROKU_MERCHANT_REPO}
    cd ..
    
    cd account-integration-sample
    heroku stack:set container -a ${HEROKU_ACCOUNT_REPO}
    heroku container:push web -a ${HEROKU_ACCOUNT_REPO}
    heroku container:release web -a ${HEROKU_ACCOUNT_REPO}
    cd ..
    proxyAccountServer
    heroku config:set --app ${HEROKU_ACCOUNT_REPO} ENV=${ENV} OF_AUTH_URL=${OF_AUTH_URL} OF_API_URL=${OF_API_URL} ACCOUNT_CLIENT_ID=${ACCOUNT_CLIENT_ID} ACCOUNT_CLIENT_SECRET=${ACCOUNT_CLIENT_SECRET} OF_ISSUER_URL=${OF_ISSUER_URL} ACCOUNT_SERVER_URL=${ACCOUNT_SERVER_URL} MERCHANT_SERVER_URL=${MERCHANT_SERVER_URL} BASIC_AUTH_CREDENTIALS=${BASIC_AUTH_CREDENTIALS} SESSION_SECRET=${SESSION_SECRET}
    echo
    echo " ____    _____      _      ____    _____ "
    echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
    echo "\___ \    | |     / _ \   | |_) |   | |  "
    echo " ___) |   | |    / ___ \  |  _ <    | |  "
    echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
    echo
    echo "============================================= ALL GOOD ============================================="
    if [ -z "$HEROKU_OPEN_BROWSER" ] || [ $HEROKU_OPEN_BROWSER == "true" ]; then
        heroku open --app ${HEROKU_MERCHANT_REPO}
    fi
}
function herokuEnv() {
    herokuMerchantRepo=$(grep 'HEROKU_MERCHANT_REPO' .env |  tr '\n' '\0')
    HEROKU_MERCHANT_REPO=${herokuMerchantRepo#*=}
    
    herokuAccountRepo=$(grep 'HEROKU_ACCOUNT_REPO' .env |  tr '\n' '\0')
    HEROKU_ACCOUNT_REPO=${herokuAccountRepo#*=}

    herokuApiKey=$(grep 'HEROKU_API_KEY' .env |  tr '\n' '\0')
    HEROKU_API_KEY=${herokuApiKey#*=}

    herokuUserName=$(grep 'HEROKU_USER_NAME' .env |  tr '\n' '\0')
    HEROKU_USER_NAME=${herokuUserName#*=}

    herokuOpenBrowser=$(grep 'HEROKU_OPEN_BROWSER' .env |  tr '\n' '\0')
    HEROKU_OPEN_BROWSER=${herokuOpenBrowser#*=}

    if [ -z "$HEROKU_MERCHANT_REPO" ]; then
        echo "Enter HEROKU_MERCHANT_APP: "  
        read HEROKU_MERCHANT_REPO
    fi
    if [ -z "$HEROKU_ACCOUNT_REPO" ]; then
        echo "Enter HEROKU_ACCOUNT_APP: "  
        read HEROKU_ACCOUNT_REPO
    fi
}
herokuEnv
networkUp