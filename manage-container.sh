#!/bin/bash

CONTAINER_NAME="mysql-todoapp"

# Check if the container exists
EXISTING_CONTAINER=$(sudo docker ps -aq -f name=$CONTAINER_NAME)

if [ -n "$EXISTING_CONTAINER" ]; then
    # Check if the container is running
    RUNNING_CONTAINER=$(sudo docker ps -q -f name=$CONTAINER_NAME)

    if [ -n "$RUNNING_CONTAINER" ]; then
        echo "Container '$CONTAINER_NAME' is already running."
    else
        echo "Starting stopped container '$CONTAINER_NAME'..."
        sudo docker start $CONTAINER_NAME
    fi
else
    echo "No existing container found. Creating and starting '$CONTAINER_NAME'..."
    sudo docker compose up -d
fi
