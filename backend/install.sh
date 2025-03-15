
#!/bin/bash

# Navigate to the backend directory
cd "$(dirname "$0")"

# Install dependencies
npm install

# Check if MongoDB is running
echo "Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    mongod_status=$(pgrep mongod)
    if [ -z "$mongod_status" ]; then
        echo "MongoDB is not running. You may need to start it."
    else
        echo "MongoDB is running."
    fi
else
    echo "MongoDB command not found. Make sure MongoDB is installed."
fi

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file from example. Please update the values as needed."
fi

echo ""
echo "To start the server, run: npm run dev"
