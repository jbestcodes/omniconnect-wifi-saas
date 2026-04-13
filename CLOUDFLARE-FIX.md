# Cloudflare Pages + VPS Backend Setup

## The Problem
Cloudflare Pages only hosts static frontend. Your app needs:
- API routes (Node.js server)
- Database connections
- Environment variables
- Paystack webhooks

## Solution: Hybrid Architecture

### 1. Frontend on Cloudflare Pages
- Static React components
- No API routes
- No server-side code
- URL: https://omniconnect-wifi.pages.dev

### 2. Backend on VPS
- API routes
- Database
- Environment variables
- Paystack webhooks
- URL: https://api.your-domain.com

## Setup Steps

### Step 1: Update Frontend for API Calls
```bash
# Add API base URL to Cloudflare Pages environment variables
NEXT_PUBLIC_API_URL=https://your-vps-domain.com
```

### Step 2: Deploy Backend to VPS
```bash
# On your VPS
git clone https://github.com/jbestcodes/omniconnect-wifi-saas.git
cd omniconnect-wifi-saas
npm install
npm run build
npm start
```

### Step 3: Update Cloudflare Pages Environment
In Cloudflare Pages dashboard:
1. Go to Settings > Environment variables
2. Add: `NEXT_PUBLIC_API_URL=https://your-vps-domain.com`
3. Add: `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...`
4. Redeploy

### Step 4: Test the Setup
Frontend: https://omniconnect-wifi.pages.dev
Backend:  https://your-vps-domain.com/api/health

## Alternative: Full VPS Deployment
For simplicity, deploy everything to VPS:
```bash
# Use Docker Compose
docker-compose up -d

# Point Cloudflare DNS to VPS
# Everything works from one domain
```

## Environment Variables

### Cloudflare Pages (Frontend)
```
NEXT_PUBLIC_API_URL=https://your-vps-domain.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
```

### VPS (Backend)
```
MONGODB_URI=mongodb://...
PAYSTACK_SECRET_KEY=sk_live_...
JWT_SECRET=your-secret
OMADA_CONTROLLER_URL=...
```

## User Flow
1. User visits Cloudflare Pages URL
2. Frontend calls VPS API for packages
3. Paystack payment processed
4. VPS webhook handles payment confirmation
5. User gets internet access

This gives you:
- Fast global CDN (Cloudflare)
- Full backend capabilities (VPS)
- Professional domain setup
- Revenue generation ready
