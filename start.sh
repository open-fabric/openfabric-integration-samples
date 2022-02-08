
MODE=dev
API_DEV=https://api.dev.openfabric.co
API_SANDBOX=https://api.sandbox.openfabric.co
API_URL=$API_DEV

function networkDown() {
    docker-compose down --rmi all
    # docker-compose down
}

function setupEnviroment() {
    PS3='Please enter your enviroment: '
    options=("DEV" "SANDBOX")
    select opt in "${options[@]}"
    do
        case $opt in
            "DEV")
                echo "you choose DEV"
                MODE=DEV
                API_URL=$API_DEV
                break
            ;;
            "SANDBOX")
                echo "you choose SANDBOX"
                MODE=SANDBOX
                API_URL=$API_SANDBOX
                break
            ;;
            *) echo "invalid option $REPLY";;
        esac
    done
}

function proxyAccountServer() {
    URL=$(curl $(docker port ngrok-account-server 4040)/api/tunnels/command_line | jq -r '.public_url')
    URL+="/account-create-transaction"
    echo "$URL"
    echo $API_URL
}

function networkUp() {
    networkDown
    setupEnviroment
    docker-compose up --force-recreate -d 2>&1
    if [ $? -ne 0 ]; then
        echo "ERROR !!!! Unable to start network"
        exit 1
    fi
    
    sleep 1
    echo "Sleeping 5s to allow ngrok docker to complete booting"
    sleep 4
    echo
    echo " ____    _____      _      ____    _____ "
    echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
    echo "\___ \    | |     / _ \   | |_) |   | |  "
    echo " ___) |   | |    / ___ \  |  _ <    | |  "
    echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
    echo
    echo "Build your first sample done"
    proxyAccountServer
    # call update API

    echo "Open http://localhost:3000 on your browser"
}

networkUp