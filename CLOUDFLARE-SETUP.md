# Cloudflare Frontend Setup Guide

## Cloudflare Configuration

### 1. Sign Up for Cloudflare
- Go to [cloudflare.com](https://cloudflare.com)
- Create a free account
- Add your domain (you can buy one cheap or use a free subdomain)

### 2. DNS Configuration
In Cloudflare DNS dashboard, add these records:

```
Type: A
Name: @ (your domain)
Content: YOUR_VPS_IP_ADDRESS
Proxy: Enabled (orange cloud)
TTL: Auto

Type: A
Name: www
Content: YOUR_VPS_IP_ADDRESS
Proxy: Enabled (orange cloud)
TTL: Auto

Type: A
Name: api (optional for API subdomain)
Content: YOUR_VPS_IP_ADDRESS
Proxy: Enabled (orange cloud)
TTL: Auto
```

### 3. SSL/TLS Settings
- Go to SSL/TLS > Overview
- Set to **Full (strict)**
- This ensures end-to-end encryption

### 4. Security Settings
- Go to Security > WAF
- Enable basic protection rules
- Set Firewall Rules to allow your region if needed

### 5. Performance Settings
- Go to Caching > Configuration
- Enable caching for static assets
- Set Browser Cache TTL to 4 hours

### 6. Page Rules (Optional)
Create rules for better performance:

```
Rule 1:
URL: *yourdomain.com/_next/static/*
Settings: Cache Level: Cache Everything
Edge Cache TTL: 1 month

Rule 2:
URL: *yourdomain.com/api/*
Settings: Cache Level: Bypass
```

## Environment Variables for Production

Update your `.env` file on VPS:

```env
# Production URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Paystack (use live keys for production)
PAYSTACK_SECRET_KEY=sk_live_your_live_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_key

# MongoDB (use Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/omniconnect

# JWT (generate a strong secret)
JWT_SECRET=your-super-secure-256-bit-secret-key-here

# Omada (if using)
OMADA_CONTROLLER_URL=https://your-omada-controller.com
OMADA_USERNAME=admin
OMADA_PASSWORD=secure_password
OMADA_SITE_ID=Default
```

## Testing URLs After Deployment

- **Main Site**: `https://yourdomain.com/?clientMac=AA:BB:CC:DD:EE:FF`
- **Admin Panel**: `https://yourdomain.com/admin`
- **API Health**: `https://yourdomain.com/api/health`
- **Business Site**: `https://yourdomain.com/?clientMac=AA:BB:CC:DD:EE:FF&siteId=business-1`

## Benefits of This Setup

### VPS Backend:
- Full control over your application
- No revenue sharing with hosting platform
- Can handle high traffic
- Direct database access
- Custom configurations

### Cloudflare Frontend:
- Free SSL certificate
- Global CDN for fast loading
- DDoS protection
- Caching for better performance
- Easy domain management
- No bandwidth limits

## Cost Breakdown

### VPS (DigitalOcean/Vultr/Linode):
- $5-10/month for basic plan
- Enough for thousands of users
- Scales easily

### Cloudflare:
- Free tier sufficient for most use cases
- Pro plan ($20/month) only if you need advanced features

### Domain:
- $10-15/year for .com
- Free alternatives: .tk, .ml, .ga

## Troubleshooting

### Common Issues:

1. **SSL Errors**: Make sure SSL is set to "Full (strict)" in Cloudflare
2. **API Not Working**: Check that A record points to VPS IP
3. **Slow Loading**: Enable Cloudflare caching
4. **502 Errors**: Check if Docker containers are running on VPS

### Commands for VPS Debugging:

```bash
# Check Docker containers
docker ps

# Check logs
docker logs omniconnect_app_1

# Restart services
docker-compose restart

# Check nginx config
docker exec omniconnect_nginx_1 nginx -t
```
