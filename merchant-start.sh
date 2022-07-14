

ENV=sandbox
OF_API_URL=https://api.sandbox.openfabric.co
OF_AUTH_URL=https://auth.sandbox.openfabric.co/oauth2/token
OF_ISSUER_URL=https://issuer.sandbox.openfabric.co
ACCOUNT_SERVER_URL=https://awesome-payment-sb.herokuapp.com
PAYMENT_METHODS=awesome-payment
function networkDown() {
    docker-compose down --rmi local
}

function variablesUpdate() {
    currentEnv=$(grep 'ENV' .env |  tr '\n' '\0')
    CURRENT_ENV=${currentEnv#*=}    

    paymentGatewayPublishKey=$(grep 'PAYMENT_GATEWAY_PUBLISH_KEY' .env |  tr '\n' '\0')
    PAYMENT_GATEWAY_PUBLISH_KEY=${paymentGatewayPublishKey#*=}
    if [ -z "$PAYMENT_GATEWAY_PUBLISH_KEY" ]; then
        PAYMENT_GATEWAY_PUBLISH_KEY=xnd_public_development_AZVI4iAxXD6fCgKzxhy1Rvr5obpIvKcJXNnXldhfjhJbWB7RDhwzakaf2dF3tQM
    fi

    paymentGatewayName=$(grep 'PAYMENT_GATEWAY_NAME' .env |  tr '\n' '\0')
    PAYMENT_GATEWAY_NAME=${paymentGatewayName#*=}
    if [ -z "$PAYMENT_GATEWAY_NAME" ]; then
        PAYMENT_GATEWAY_NAME=xendit
    fi
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
        ACCOUNT_SERVER_URL=https://awesome-payment.herokuapp.com
        ENV=$CURRENT_ENV
    fi
    export OF_API_URL=$OF_API_URL
    export OF_AUTH_URL=$OF_AUTH_URL
    export OF_ISSUER_URL=$OF_ISSUER_URL
    export ENV=$ENV
    export ACCOUNT_SERVER_URL=$ACCOUNT_SERVER_URL
    export PAYMENT_METHODS=$PAYMENT_METHODS
    export PAYMENT_GATEWAY_PUBLISH_KEY=$PAYMENT_GATEWAY_PUBLISH_KEY
    export PAYMENT_GATEWAY_NAME=$PAYMENT_GATEWAY_NAME
    export ACCOUNT_CLIENT_ID=$ACCOUNT_CLIENT_ID
    export ACCOUNT_CLIENT_SECRET=$ACCOUNT_CLIENT_SECRET

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
    docker-compose up --force-recreate -d 2>&1 merchant-integration-sample
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
    echo
    echo "============================================= ALL GOOD ============================================="
    echo
    echo "Open http://localhost:3000 on your browser"
    echo
}

networkUp
