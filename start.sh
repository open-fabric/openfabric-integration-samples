

function networkDown() {
    docker-compose down --rmi all
    # docker-compose down
}

function proxyAccountServer() {
    URL=$(curl -s $(docker port ngrok-account-server 4040)/api/tunnels/command_line | jq -r '.public_url')
    URL+="/account-create-transaction"
    
    apiURL=$(grep 'OF_API_URL' .env)
    OF_API_URL=${apiURL#*=}
    
    ofAuthUrl=$(grep 'OF_AUTH_URL' .env)
    OF_AUTH_URL=${ofAuthUrl#*=}
    
    accountClientId=$(grep 'ACCOUNT_CLIENT_ID' .env |  tr '\n' '\0')
    ACCOUNT_CLIENT_ID=${accountClientId#*=}
    
    accountClientSecret=$(grep 'ACCOUNT_CLIENT_SECRET' .env |  tr '\n' '\0')
    ACCOUNT_CLIENT_SECRET=${accountClientSecret#*=}
    
    
    BASE_64=$(printf $ACCOUNT_CLIENT_ID:$ACCOUNT_CLIENT_SECRET | base64)
    
    #get account access token
    ACCESSTOKEN=$(curl -s --location --request POST $OF_AUTH_URL \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --header "Authorization: Basic $BASE_64" \
    --data-urlencode 'grant_type=client_credentials' | jq -r '.access_token')
    
    # update account endpoint
    echo
    echo "================================ Publish Sample Account Endpoint ================================"
    echo
    UPDATE_RESULT=$(curl -s --location --request PUT $OF_API_URL/a/settings \
        --header "Authorization: Bearer $ACCESSTOKEN" \
        --header 'Content-Type: application/json' \
        --data-raw '{
    "account_transaction_url": "'$URL'",
    "auth_config": {"method": "X-API-KEY", "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"}
    }' | jq -r '.account_transaction_url')
    echo
    echo "Sample account endpoint: "$UPDATE_RESULT
    echo
}

function networkUp() {
    networkDown
    docker-compose up --build -d 2>&1
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
    proxyAccountServer
    echo
    echo "============================================= ALL GOOD ============================================="
    echo
    echo "Open http://localhost:3000 on your browser"
    echo
}

networkUp
