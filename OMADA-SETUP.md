# Omada Controller External Portal Setup

## 🎯 **Portal URL Configuration**

In your Omada Controller, set the External Portal URL to:

```
https://wifipay.site/api/portal
```

## 📋 **Parameters That Will Be Captured**

The portal endpoint will log and capture:
- `clientMac` - Client device MAC address
- `apMac` - Access Point MAC address  
- `ssidName` - WiFi network name
- `siteId` - Multi-tenant site ID

## 🔍 **Debugging Logs**

When users connect to WiFi, you'll see logs like:

```
🔥 Portal hit from MAC: AA:BB:CC:DD:EE:FF
🔥 Portal hit from AP: 11:22:33:44:55:66
🔥 Portal hit from SSID: WiFi-Pay
🔥 Full URL: /api/portal?clientMac=AA:BB:CC:DD:EE:FF&apMac=11:22:33:44:55:66&ssidName=WiFi-Pay
🔥 User-Agent: Mozilla/5.0...
🔥 IP: 192.168.1.100
🚀 Redirecting to: /?clientMac=AA:BB:CC:DD:EE:FF&apMac=11:22:33:44:55:66&ssidName=WiFi-Pay
```

## 🚀 **How It Works**

1. **User connects to WiFi** → Omada redirects to `/api/portal`
2. **Portal endpoint logs** → Captures all parameters
3. **Redirects to app** → `/` with all parameters intact
4. **App loads paywall** → Shows packages with MAC address

## 🔧 **Testing Commands**

```bash
# Test portal endpoint directly
curl "https://wifipay.site/api/portal?clientMac=AA:BB:CC:DD:EE:FF&apMac=11:22:33:44:55:66&ssidName=WiFi-Pay"

# Check logs on server
docker logs omniconnect-wifi-saas_app_1
```

## 📱 **Omada Controller Settings**

1. Go to **Controller Settings** → **Portal Settings**
2. Set **Portal Type** to **External Portal**
3. Set **External Portal URL** to: `https://wifipay.site/api/portal`
4. Save and apply settings
5. Test by connecting to WiFi

This will ensure Omada redirects to your app instead of showing default Terms page!
