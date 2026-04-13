# 💳 Paystack Integration Setup

## 1. Create Paystack Account
1. Go to [Paystack.co](https://paystack.co)
2. Sign up for business account
3. Complete verification (ID, business documents)

## 2. Get Your Keys

### Test Keys (for development)
```bash
# In Paystack Dashboard → Settings → API Keys
Public Test Key: pk_test_xxxxxxxxxxxxxxxx
Secret Test Key: sk_test_xxxxxxxxxxxxxxxx
```

### Live Keys (for production)
```bash
# After verification
Public Live Key: pk_live_xxxxxxxxxxxxxxxx
Secret Live Key: sk_live_xxxxxxxxxxxxxxxx
```

## 3. Configure Subaccounts (for multi-tenant)

### Create Subaccounts
1. **Paystack Dashboard** → **Subaccounts**
2. **Create Subaccount** for each business:
   - Business Name: "Customer WiFi Hotspot"
   - Business Email: customer@email.com
   - Settlement Bank: Customer's bank details

### Subaccount Integration
```typescript
// In your app when creating business owner
const subaccount = await paystack.subaccount.create({
  business_name: "Business Name",
  settlement_bank: "Bank Code",
  account_number: "Account Number",
  percentage_charge: 5.0, // Your platform fee
  primary_contact_email: "business@email.com"
});

// Save subaccount_code to User model
user.paystackSubaccountCode = subaccount.data.subaccount_code;
```

## 4. Webhook Setup

### Configure Webhook URL
1. **Paystack Dashboard** → **Settings** → **Webhooks**
2. **Add Webhook URL**: `https://your-domain.site/api/webhook/paystack`
3. **Events to listen for**:
   - `charge.success`
   - `transfer.failed`
   - `transfer.success`

### Webhook Security
```typescript
// In your webhook handler
const secret = process.env.PAYSTACK_SECRET_KEY;
const hash = crypto.createHmac('sha512', secret)
  .update(body)
  .digest('hex');

if (hash !== signature) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
}
```

## 5. Payment Flow Integration

### Frontend Payment
```typescript
// When user selects package
const response = await PaystackPop.setup({
  key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  email: 'customer@email.com',
  amount: packagePrice * 100, // Convert to kobo
  currency: 'KES',
  subaccount: businessOwner.subaccountCode, // Revenue splitting
  metadata: {
    clientMac: 'AA:BB:CC:DD:EE:FF',
    packageId: package._id,
    siteId: siteId,
    ownerId: businessOwner._id
  },
  callback: 'https://your-domain.site/payment-success',
  onClose: () => console.log('Payment closed')
});
```

### Revenue Splitting
```
Total Payment: KES 100
- Platform Fee (5%): KES 5
- Business Owner: KES 95
- Paystack Fee: ~KES 1.5
```

## 6. Testing

### Test Transactions
```bash
# Use test cards:
Card Number: 5060 6300 0000 0000 00
Expiry: 12/25
CVV: 123
```

### Test Webhook
```bash
# Use Paystack CLI or ngrok for local testing
curl -X POST https://your-domain.site/api/webhook/paystack \
  -H "Content-Type: application/json" \
  -d '{"event": "charge.success", "data": {...}}'
```

## 7. Live Deployment Checklist

- [ ] Paystack account verified
- [ ] Live API keys configured
- [ ] Subaccounts created for business owners
- [ ] Webhook URL configured and tested
- [ ] Test payments successful
- [ ] Revenue splitting working
- [ ] Bank accounts verified for settlements

## 8. Business Owner Onboarding

### Automatic Subaccount Creation
```typescript
// When new business owner signs up
const subaccount = await createPaystackSubaccount({
  businessName: businessOwner.businessName,
  email: businessOwner.email,
  bankAccount: businessOwner.bankDetails
});

// Update business owner record
await User.findByIdAndUpdate(businessOwner._id, {
  paystackSubaccountCode: subaccount.subaccount_code
});
```

## Support
- Paystack Support: support@paystack.co
- Documentation: [docs.paystack.co](https://docs.paystack.co)
- API Reference: [api.paystack.co](https://api.paystack.co)

Ready to accept payments! 💳
