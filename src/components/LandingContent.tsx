
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PaystackButton } from 'react-paystack';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, WifiOff, MessageCircle, Package } from 'lucide-react';
// import { generatePersonalizedWelcomeMessage } from '@/ai/flows/generate-personalized-welcome-message';

interface PackageData {
  _id: string;
  name: string;
  price: number;
  duration_mins: number;
  data_limit_gb: number;
  is_unlimited: boolean;
  description?: string;
}

interface SiteOwner {
  name: string;
  whatsappNumber?: string;
  businessName?: string;
}

export default function LandingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [clientMac, setClientMac] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [siteOwner, setSiteOwner] = useState<SiteOwner | null>(null);
  const [siteLoading, setSiteLoading] = useState(true);

  useEffect(() => {
    const mac = searchParams.get('clientMac');
    const siteId = searchParams.get('siteId');
    
    if (mac) {
      setClientMac(mac);
    }
    
    if (siteId) {
      loadSiteData(siteId);
    } else {
      // Load default packages if no siteId
      loadDefaultPackages();
    }
  }, [searchParams]);

  const loadSiteData = async (siteId: string) => {
    try {
      setSiteLoading(true);
      
      // Load site owner info
      const ownerResponse = await fetch(`/api/sites/${siteId}/owner`);
      if (ownerResponse.ok) {
        const ownerData = await ownerResponse.json();
        setSiteOwner(ownerData.data);
      }
      
      // Load packages for this site
      const packagesResponse = await fetch(`/api/sites/${siteId}/packages`);
      if (packagesResponse.ok) {
        const packagesData = await packagesResponse.json();
        setPackages(packagesData.data);
        if (packagesData.data.length > 0) {
          setSelectedPackage(packagesData.data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading site data:', error);
      // Fallback to default packages
      loadDefaultPackages();
    } finally {
      setSiteLoading(false);
    }
  };

  const loadDefaultPackages = async () => {
    try {
      setSiteLoading(true);
      const response = await fetch('/api/packages/public');
      if (response.ok) {
        const data = await response.json();
        setPackages(data.data);
        if (data.data.length > 0) {
          setSelectedPackage(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setSiteLoading(false);
    }
  };

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder';
  const email = 'user@omniconnect.pay'; // Placeholder or captured from user
  const siteId = searchParams.get('siteId');

  // Get subaccount code from site owner or use default
  const subaccountCode = siteOwner?.paystackSubaccountCode;

  const componentProps = {
    email,
    amount: selectedPackage ? selectedPackage.price * 100 : 5000, // Convert to kobo
    subaccount: subaccountCode, // Add subaccount for payment routing
    metadata: {
      custom_fields: [
        {
          display_name: "Client MAC",
          variable_name: "client_mac",
          value: clientMac || 'Unknown',
        },
        {
          display_name: "Package",
          variable_name: "package_name",
          value: selectedPackage?.name || 'Standard',
        },
        {
          display_name: "Site ID",
          variable_name: "site_id",
          value: siteId || 'default',
        },
        {
          display_name: "Business Owner",
          variable_name: "business_name",
          value: siteOwner?.businessName || siteOwner?.name || 'Platform',
        },
      ],
      client_mac: clientMac,
      package_id: selectedPackage?._id,
      site_id: siteId,
      owner_id: siteOwner?.name || 'platform',
      business_name: siteOwner?.businessName || siteOwner?.name || 'Platform',
    },
    publicKey,
    text: selectedPackage ? `Pay KES ${selectedPackage.price.toFixed(2)} Now` : "Select Package",
    onSuccess: (reference: any) => {
      handleSuccess(reference);
    },
    onClose: () => {
      console.log('Payment closed');
    },
  };

  const handleSuccess = async (reference: any) => {
    setPaymentStatus('success');
    setLoading(true);
    try {
      if (clientMac && selectedPackage) {
        // Simple welcome message without AI
        const welcomeMsg = `Welcome! Your ${selectedPackage.name} package is now active. Enjoy ${selectedPackage.duration_mins} minutes of high-speed internet access.`;
        setWelcomeMessage(welcomeMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!clientMac) {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <WifiOff className="w-10 h-10 text-destructive/60" />
        </div>
        <p className="text-sm text-destructive font-medium mb-1">MAC Address Not Detected</p>
        <p className="text-xs text-muted-foreground">Please ensure you are connected to the network to continue.</p>
      </div>
    );
  }

  if (siteLoading) {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <p className="text-sm text-muted-foreground mb-1">Loading available packages...</p>
        <p className="text-xs text-muted-foreground">Please wait while we connect you to the best options.</p>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-secondary" />
        </div>
        <h3 className="text-xl font-bold">Access Granted!</h3>
        <p className="text-sm text-muted-foreground px-4">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating your personalized experience...
            </span>
          ) : (
            welcomeMessage || "Thank you for your payment. You are now connected to high-speed internet."
          )}
        </p>
        <Button className="w-full mt-4" variant="default" onClick={() => router.push("https://google.com")}>
          Start Browsing
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <Badge variant="secondary" className="mb-2">Network ID: {clientMac}</Badge>
        <h2 className="text-2xl font-bold font-headline">
          {siteOwner?.businessName || siteOwner?.name || 'OmniConnect'} - Internet Access
        </h2>
        <p className="text-sm text-muted-foreground">Choose your internet package</p>
      </div>

      {/* Package Selection */}
      <div className="space-y-3">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedPackage?._id === pkg._id
                ? 'bg-primary/10 border-primary'
                : 'bg-accent/30 border-accent hover:bg-accent/50'
            }`}
            onClick={() => setSelectedPackage(pkg)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold">{pkg.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {pkg.is_unlimited 
                    ? 'Unlimited data' 
                    : `${pkg.data_limit_gb} GB data limit`
                  } for {pkg.duration_mins} minutes
                </p>
                {pkg.description && (
                  <p className="text-xs text-muted-foreground">{pkg.description}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">KES {pkg.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPackage && (
        <div className="pt-2">
          <PaystackButton
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
            {...componentProps}
          />
        </div>
      )}

      <div className="pt-2">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={() => {
            const whatsappNumber = siteOwner?.whatsappNumber || '254799590637';
            window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank');
          }}
        >
          <MessageCircle className="w-4 h-4" />
          Contact Support
        </Button>
      </div>
    </div>
  );
}
