import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Log the incoming request
  console.log('🔥 Portal hit from MAC:', searchParams.get('clientMac'));
  console.log('🔥 Portal hit from AP:', searchParams.get('apMac'));
  console.log('🔥 Portal hit from SSID:', searchParams.get('ssidName'));
  console.log('🔥 Full URL:', req.url);
  console.log('🔥 User-Agent:', req.headers.get('user-agent'));
  console.log('🔥 IP:', req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'));
  
  // Get Omada Controller parameters
  const clientMac = searchParams.get('clientMac');
  const apMac = searchParams.get('apMac');
  const ssidName = searchParams.get('ssidName');
  const siteId = searchParams.get('siteId');
  
  // Redirect to main app with external domain
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://wifipay.site' 
    : 'http://localhost:3000';
  
  const externalUrl = new URL(baseUrl);
  // Add all parameters to redirect
  if (clientMac) externalUrl.searchParams.set('clientMac', clientMac);
  if (apMac) externalUrl.searchParams.set('apMac', apMac);
  if (ssidName) externalUrl.searchParams.set('ssidName', ssidName);
  if (siteId) externalUrl.searchParams.set('siteId', siteId);
  
  console.log('🚀 Redirecting to external URL:', externalUrl.toString());
  
  // Redirect to external URL
  return NextResponse.redirect(externalUrl.toString());
}
