# 🚀 OmniConnect Cloud Deployment Guide

## Quick Deploy Options

### 1. Vercel (Recommended - Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? omniconnect-wifi
# - Directory? ./
# - Want to override settings? Yes
```

### 2. Netlify (Alternative)
```bash
# Build for production
npm run build

# Deploy
npx netlify deploy --prod --dir=.next
```

### 3. Railway (Good for Backend)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## Environment Variables Needed

**Required for Production:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Random secret string
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` - Paystack public key
- `PAYSTACK_SECRET_KEY` - Paystack secret key

**Optional:**
- `OMADA_CONTROLLER_URL` - Your Omada controller URL
- `OMADA_USERNAME` - Omada admin username
- `OMADA_PASSWORD` - Omada admin password
- `OMADA_SITE_ID` - Omada site ID

## After Deployment

1. **Test the live URL** provided by deployment service
2. **Add MAC parameter**: `https://your-domain.com/?clientMac=AA:BB:CC:DD:EE:FF`
3. **Access admin**: `https://your-domain.com/admin`
4. **Configure business owners** in the admin panel

## Multi-tenant Testing URLs

- **Basic**: `https://your-domain.com/?clientMac=AA:BB:CC:DD:EE:FF`
- **Business 1**: `https://your-domain.com/?clientMac=AA:BB:CC:DD:EE:FF&siteId=business-1`
- **Business 2**: `https://your-domain.com/?clientMac=AA:BB:CC:DD:EE:FF&siteId=business-2`

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Paystack account set up
- [ ] Environment variables configured
- [ ] Custom domain (optional)
- [ ] SSL certificate (auto-provided)
- [ ] Business owner accounts created
- [ ] Test payments with real Paystack keys

## Troubleshooting

**Build Errors:**
- Check `package.json` scripts
- Verify Node.js version (18+)
- Clear node_modules and reinstall

**Runtime Errors:**
- Check environment variables in deployment dashboard
- Verify MongoDB connection
- Check API endpoints

**Payment Issues:**
- Verify Paystack keys
- Check webhook URL configuration
- Test with small amounts first
