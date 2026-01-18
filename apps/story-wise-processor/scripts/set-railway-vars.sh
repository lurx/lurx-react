#!/bin/bash
# Set Railway environment variables from .railway.env file
# Usage: ./scripts/set-railway-vars.sh

ENV_FILE=".railway.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found"
    echo "Copy .railway.env.example to .railway.env and fill in your values"
    exit 1
fi

echo "Setting Railway environment variables from $ENV_FILE..."

while IFS='=' read -r key value; do
    # Skip comments and empty lines
    [[ $key =~ ^#.*$ ]] && continue
    [[ -z $key ]] && continue

    # Remove quotes from value if present
    value="${value%\"}"
    value="${value#\"}"

    echo "Setting $key..."
    railway variables set "$key=$value"
done < "$ENV_FILE"

echo "Done! Variables set in Railway."
