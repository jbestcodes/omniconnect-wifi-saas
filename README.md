# OmniConnect Pay - Wi-Fi Hotspot Management System

A comprehensive business dashboard for managing TP-Link Omada EAP110 Wi-Fi hotspot with payment processing, voucher system, and analytics.

## Features

### 📊 Business Dashboard
- **Revenue Analytics**: Daily, weekly, and monthly revenue tracking
- **Real-time Statistics**: Active users, data consumption, connections
- **Interactive Charts**: Revenue trends and voucher status visualization
- **Live Data**: Auto-refreshing dashboard with current network status

### 💳 Package Management (CRUD)
- Create, edit, and delete internet packages
- Flexible pricing and duration settings
- Data limits with unlimited data options
- Active/inactive package status management
- Package descriptions and metadata

### 🎫 Voucher System
- Generate random 6-digit voucher codes
- Bulk voucher generation (up to 100 at once)
- Link vouchers to specific packages
- Track voucher status: unused, active, expired
- CSV export for voucher management
- Search and filter capabilities

### 💰 Payment Integration
- **Paystack Integration**: Secure payment processing
- **Webhook Verification**: HMAC signature validation
- **Package-based Pricing**: Dynamic pricing based on selected packages
- **Automatic Authorization**: Instant user access after payment

### 🌐 Omada Controller Integration
- **Client Authorization**: Automatic user access management
- **Traffic Monitoring**: Real-time data consumption tracking
- **Active Client Display**: Current connected users overview
- **Network Statistics**: Connection and usage analytics

### 📱 User Experience
- **Responsive Design**: Mobile-friendly interface
- **WhatsApp Support**: Direct contact integration
- **Real-time Updates**: Live status changes
- **Modern UI**: Clean, intuitive interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **UI Components**: Radix UI, Tailwind CSS
- **Charts**: Recharts for data visualization
- **Payment**: Paystack API
- **Network**: TP-Link Omada Controller API

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://your-connection-string

# Paystack
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxx

# Omada Controller
OMADA_CONTROLLER_URL=https://your-omada-controller.com
OMADA_USERNAME=admin
OMADA_PASSWORD=your-password
OMADA_SITE_ID=Default
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your configuration values

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Main site: http://localhost:9002
   - Admin dashboard: http://localhost:9002/admin

## API Endpoints

### Packages
- `GET /api/packages` - List all packages
- `POST /api/packages` - Create new package
- `GET /api/packages/[id]` - Get specific package
- `PUT /api/packages/[id]` - Update package
- `DELETE /api/packages/[id]` - Delete package

### Vouchers
- `GET /api/vouchers` - List all vouchers
- `POST /api/vouchers` - Generate new vouchers
- `POST /api/vouchers/[code]/use` - Redeem voucher

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Omada Integration
- `GET /api/omada/clients` - Get active clients and traffic data
- `POST /api/authorize` - Manual client authorization

### Payment Webhooks
- `POST /api/webhook/paystack` - Paystack webhook handler

## Database Schema

### Packages Collection
```javascript
{
  name: String (required),
  price: Number (required),
  duration_mins: Number (required),
  data_limit_gb: Number (required),
  is_unlimited: Boolean (default: false),
  is_active: Boolean (default: true),
  description: String (optional),
  created_at: Date,
  updated_at: Date
}
```

### Vouchers Collection
```javascript
{
  code: String (6 chars, unique, required),
  package_id: ObjectId (ref: Package),
  status: String (enum: ['unused', 'active', 'expired']),
  client_mac: String,
  used_at: Date,
  expires_at: Date,
  created_by: String (required),
  created_at: Date,
  updated_at: Date
}
```

### Transactions Collection
```javascript
{
  clientMac: String (required),
  reference: String (unique, required),
  amount: Number (required),
  status: String (default: 'pending'),
  paidAt: Date,
  accessDurationMinutes: Number (default: 60),
  package_id: ObjectId (ref: Package),
  created_at: Date,
  updated_at: Date
}
```

## Usage Guide

### 1. Setting Up Packages
1. Navigate to `/admin/packages`
2. Click "Add Package"
3. Fill in package details:
   - Name and description
   - Price in KES
   - Duration in minutes
   - Data limit or unlimited option
4. Save the package

### 2. Generating Vouchers
1. Navigate to `/admin/vouchers`
2. Click "Generate Vouchers"
3. Select a package and quantity
4. Enter your name as creator
5. Generate and download CSV if needed

### 3. Monitoring Dashboard
1. Visit `/admin` for real-time statistics
2. View revenue trends and usage analytics
3. Monitor active clients and data consumption
4. Track voucher usage patterns

### 4. Customer Payment Flow
1. Customer connects to Wi-Fi network
2. Redirected to payment portal
3. Selects package and pays via Paystack
4. Automatically authorized on Omada Controller
5. Gains internet access for purchased duration

## Security Features

- **HMAC Signature Verification**: All Paystack webhooks verified
- **Input Validation**: Comprehensive form validation with Zod
- **SQL Injection Protection**: MongoDB ODM sanitization
- **XSS Prevention**: React's built-in protections
- **CSRF Protection**: Next.js security headers

## Deployment

### Production Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Environment Setup**
   - Configure production environment variables
   - Set up MongoDB Atlas cluster
   - Configure Omada Controller API access
   - Set up Paystack webhooks

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 9002
CMD ["npm", "start"]
```

## Monitoring & Maintenance

### Health Checks
- Monitor API response times
- Check database connection status
- Verify Omada Controller connectivity
- Track payment webhook success rates

### Backups
- Regular MongoDB Atlas backups
- Export voucher data periodically
- Monitor transaction records
- Archive old log files

## Support

For technical support:
- **WhatsApp**: https://wa.me/254799590637
- **Email**: support@omniconnect.pay

## License

This project is proprietary software. All rights reserved.

---

**Version**: 2.0.0  
**Last Updated**: April 2026  
**Compatibility**: TP-Link Omada EAP110, MongoDB Atlas, Paystack
