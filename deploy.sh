#!/bin/bash

# Exit on error
set -e

PROJECT_NAME="hannya"
ENV_FILE=".env.deploy"
EXAMPLE_ENV_FILE=".env.deploy.example"

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found!"
    
    # Create the example template if it doesn't exist
    if [ ! -f "$EXAMPLE_ENV_FILE" ]; then
        echo "Creating a template $EXAMPLE_ENV_FILE..."
        cat <<EOT > "$EXAMPLE_ENV_FILE"
# Deployment configuration for $PROJECT_NAME
DEPLOY_HOST="your-server-ip-or-domain"
DEPLOY_USER="your-ssh-username"
DEPLOY_KEY="~/.ssh/id_rsa" # Optional, leave empty if using default ssh agent or password
DEPLOY_PATH="/var/www/html/$PROJECT_NAME"
EOT
    fi
    
    echo "Please copy $EXAMPLE_ENV_FILE to $ENV_FILE and fill in your server details."
    exit 1
fi

# Load variables from env file (ignoring comments and empty lines)
export $(grep -v '^#' $ENV_FILE | xargs)

# Validate inputs
if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_USER" ] || [ -z "$DEPLOY_PATH" ]; then
    echo "Error: DEPLOY_HOST, DEPLOY_USER, and DEPLOY_PATH must be set in $ENV_FILE"
    exit 1
fi

# Setup SSH identity parameter if provided
SSH_OPTS=""
if [ -n "$DEPLOY_KEY" ]; then
    # Expand tilde (~) if present in the path
    EXPANDED_KEY="${DEPLOY_KEY/#\~/$HOME}"
    SSH_OPTS="-i $EXPANDED_KEY"
fi

echo "=========================================="
echo " Starting local build & deploy for $PROJECT_NAME"
echo "=========================================="

# 1. Build locally
echo "Building project locally..."
npm run build

# 2. Check if build directory exists
if [ ! -d "dist" ]; then
    echo "Error: Build output directory 'dist' not found!"
    exit 1
fi

# 3. Compress build files
echo "Compressing build files..."
TAR_FILE="dist-${PROJECT_NAME}.tar.gz"
tar -czf "$TAR_FILE" -C dist .

# 4. Upload build to server
REMOTE_TAR="/tmp/$TAR_FILE"
echo "Uploading build archive to $DEPLOY_HOST..."
scp $SSH_OPTS "$TAR_FILE" "$DEPLOY_USER@$DEPLOY_HOST:$REMOTE_TAR"

# 5. Extract build and replace existing files
echo "Extracting build on target server..."
ssh $SSH_OPTS "$DEPLOY_USER@$DEPLOY_HOST" "
    # Ensure target directory exists
    mkdir -p \"$DEPLOY_PATH\"
    
    # Remove old files in target directory
    rm -rf \"$DEPLOY_PATH\"/*
    
    # Extract new files
    tar -xzf \"$REMOTE_TAR\" -C \"$DEPLOY_PATH\"
    
    # Clean up remote tarball
    rm \"$REMOTE_TAR\"
"

# 6. Clean up local tarball
echo "Cleaning up local files..."
rm "$TAR_FILE"

echo "=========================================="
echo " Successfully deployed $PROJECT_NAME to $DEPLOY_HOST:$DEPLOY_PATH!"
echo "=========================================="
