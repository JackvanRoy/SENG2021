if command -v apt-get &> /dev/null; then
    # Update package repositories and install Node.js
    sudo apt-get update
    sudo apt-get install -y nodejs

# Check if yum is available
elif command -v yum &> /dev/null; then
    # Install EPEL repository (for CentOS, Amazon Linux)
    sudo yum install -y epel-release

    # Install Node.js from EPEL repository
    sudo yum install -y nodejs

else
    echo "Error: Package manager not found. This script requires a system with apt-get or yum." >&2
    exit 1
fi

# Install nodemon globally

sudo npm install -g nodemon ts-node

cd /var/www/app
sudo chmod g+s /var/www/app
sudo chmod o-rwx /var/www/app
npm install
