# 🚀 Deployment Checklist for .site Domain

## Pre-Deployment Prep

### ✅ Code Ready
- [x] Multi-tenant SaaS platform complete
- [x] Docker configuration ready
- [x] Environment variables template
- [x] Paystack integration
- [x] Production deployment scripts

### 📋 Domain Setup (After Purchase)
- [ ] Buy .site domain from Namecheap
- [ ] Change nameservers to Cloudflare
- [ ] Add A records in Cloudflare
- [ ] Enable SSL (Full mode)

### 🖥️ VPS Setup (Kamatera)
- [ ] SSH into VPS
- [ ] Install Docker
- [ ] Clone repository
- [ ] Configure environment
- [ ] Deploy with docker-compose

### 🔧 Integration Steps
- [ ] Configure Paystack live keys
- [ ] Set up MongoDB Atlas
- [ ] Configure Omada Controller (if using)
- [ ] Test payment flow
- [ ] Verify multi-tenant functionality

## Quick Commands Ready

### VPS Deployment
```bash
# SSH to Kamatera
ssh root@your-vps-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Deploy App
git clone https://github.com/jbestcodes/omniconnect-wifi-saas.git
cd omniconnect-wifi-saas
cp .env.template .env
# Edit .env with your keys
docker-compose up -d
```

### Cloudflare DNS
```
Type: A
Name: @
Content: YOUR_VPS_IP
Proxy: Enabled (orange cloud)

Type: A
Name: www
Content: YOUR_VPS_IP
Proxy: Enabled (orange cloud)
```

## Environment Variables Needed

### Production Keys
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/omniconnect

# Paystack (Live)
PAYSTACK_SECRET_KEY=sk_live_your_live_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_key

# Security
JWT_SECRET=your-super-secure-jwt-secret

# Omada (if using)
OMADA_CONTROLLER_URL=https://your-omada.com
OMADA_USERNAME=admin
OMADA_PASSWORD=your_password
OMADA_SITE_ID=Default
```

## Testing URLs After Deployment

- Main Site: `https://your-domain.site/?clientMac=AA:BB:CC:DD:EE:FF`
- Admin Panel: `https://your-domain.site/admin`
- API Health: `https://your-domain.site/api/health`

## Revenue Ready Features

✅ Multi-tenant architecture
✅ Paystack payment processing
✅ Subaccount revenue splitting
✅ Real-time dashboard
✅ WhatsApp support integration
✅ Professional branding
✅ Global CDN (Cloudflare)
✅ SSL security
✅ Mobile responsive

Ready when you are! 🚀
