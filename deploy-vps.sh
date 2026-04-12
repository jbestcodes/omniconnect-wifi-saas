#!/bin/bash

# VPS Deployment Script for OmniConnect
echo "=== OmniConnect VPS Deployment ==="

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install UFW firewall
echo "Configuring firewall..."
sudo apt install ufw -y
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Create app directory
echo "Setting up application directory..."
sudo mkdir -p /opt/omniconnect
sudo chown $USER:$USER /opt/omniconnect
cd /opt/omniconnect

# Copy files (you'll need to upload your project files here)
echo "Please upload your project files to /opt/omniconnect"
echo "Required files:"
echo "- package.json"
echo "- Dockerfile"
echo "- docker-compose.yml"
echo "- nginx.conf"
echo "- src/ directory"
echo "- .env file"

# Create environment file template
echo "Creating environment file template..."
cat > .env.template << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/omniconnect
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password_here

# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Omada Controller Configuration
OMADA_CONTROLLER_URL=https://your-omada-controller.com
OMADA_USERNAME=admin
OMADA_PASSWORD=your_omada_password
OMADA_SITE_ID=Default

# Node Configuration
NODE_ENV=production
PORT=3000
EOF

echo "=== Setup Complete ==="
echo "Next steps:"
echo "1. Upload your project files to /opt/omniconnect"
echo "2. Copy .env.template to .env and fill in your values"
echo "3. Run: docker-compose up -d"
echo "4. Configure Cloudflare to point to your VPS IP"
echo ""
echo "Your app will be available at: http://your-vps-ip"
