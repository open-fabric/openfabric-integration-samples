
MODE=dev
API_DEV=https://api.dev.openfabric.co
API_SANDBOX=https://api.sandbox.openfabric.co

function networkDown() {
    docker-compose down
}

function networkUp() {
    networkDown
    echo "Input Mode"
    read MODE
    echo "Mode input: " $MODE
    docker-compose up --force-recreate -d 2>&1
    if [ $? -ne 0 ]; then
        echo "ERROR !!!! Unable to start network"
        exit 1
    fi
    sleep 10
    echo
    echo " ____    _____      _      ____    _____ "
    echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
    echo "\___ \    | |     / _ \   | |_) |   | |  "
    echo " ___) |   | |    / ___ \  |  _ <    | |  "
    echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
    echo
    echo "Build your first sample done"
    URL=$(curl $(docker port ngrok-account-server 4040)/api/tunnels/command_line | jq '.public_url')
    echo $URL
    # call update API
}

networkUp