'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, WifiOff, MessageCircle, Package } from 'lucide-react';

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

export default function LandingContentSimple() {
  const searchParams = useSearchParams();
  const [clientMac, setClientMac] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [siteOwner, setSiteOwner] = useState<SiteOwner | null>(null);
  const [siteLoading, setSiteLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Mock packages for testing
  const mockPackages: PackageData[] = [
    {
      _id: '1',
      name: 'Basic Pass',
      price: 50,
      duration_mins: 60,
      data_limit_gb: 1,
      is_unlimited: false,
      description: 'Perfect for quick browsing and emails'
    },
    {
      _id: '2',
      name: 'Standard Pass',
      price: 100,
      duration_mins: 120,
      data_limit_gb: 3,
      is_unlimited: false,
      description: 'Great for streaming and social media'
    },
    {
      _id: '3',
      name: 'Premium Pass',
      price: 200,
      duration_mins: 240,
      data_limit_gb: 10,
      is_unlimited: false,
      description: 'Ideal for heavy users and downloads'
    },
    {
      _id: '4',
      name: 'Unlimited Pass',
      price: 500,
      duration_mins: 1440,
      data_limit_gb: 0,
      is_unlimited: true,
      description: '24 hours of unlimited high-speed internet'
    }
  ];

  useEffect(() => {
    const mac = searchParams.get('clientMac');
    const siteId = searchParams.get('siteId');
    
    if (mac) {
      setClientMac(mac);
    }
    
    // Simulate loading site data
    setTimeout(() => {
      setSiteOwner({
        name: 'Test Business',
        businessName: 'Test WiFi Hotspot',
        whatsappNumber: '254799590637'
      });
      setPackages(mockPackages);
      setSelectedPackage(mockPackages[0]);
      setSiteLoading(false);
    }, 1000);
  }, [searchParams]);

  const setPackages = (packages: PackageData[]) => {
    // This would normally come from API
    console.log('Packages loaded:', packages);
  };

  const handlePayment = () => {
    // Simulate payment processing
    setPaymentStatus('success');
    setTimeout(() => {
      setPaymentStatus('idle');
    }, 5000);
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
          Thank you for your payment. You are now connected to high-speed internet.
        </p>
        <Button className="w-full mt-4" variant="default" onClick={() => window.location.href = "https://google.com"}>
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
        {mockPackages.map((pkg) => (
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
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg shadow-lg transition-all active:scale-[0.98]"
            onClick={handlePayment}
          >
            Pay KES {selectedPackage.price.toFixed(2)} Now (Test Mode)
          </Button>
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

      <div className="text-center">
        <Badge variant="outline" className="text-xs">
          Test Mode - No Real Payments
        </Badge>
      </div>
    </div>
  );
}
