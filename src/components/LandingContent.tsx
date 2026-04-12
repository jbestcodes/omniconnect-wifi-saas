
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PaystackButton } from 'react-paystack';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, WifiOff } from 'lucide-react';
import { generatePersonalizedWelcomeMessage } from '@/ai/flows/generate-personalized-welcome-message';

export default function LandingContent() {
  const searchParams = useSearchParams();
  const [clientMac, setClientMac] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mac = searchParams.get('clientMac');
    if (mac) {
      setClientMac(mac);
    }
  }, [searchParams]);

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder';
  const amount = 50 * 100; // 50 KES in kobo
  const email = 'user@omniconnect.pay'; // Placeholder or captured from user

  const componentProps = {
    email,
    amount,
    metadata: {
      custom_fields: [
        {
          display_name: "Client MAC",
          variable_name: "client_mac",
          value: clientMac || 'Unknown',
        },
      ],
      client_mac: clientMac
    },
    publicKey,
    text: "Pay KES 50.00 Now",
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
      if (clientMac) {
        const response = await generatePersonalizedWelcomeMessage({
          clientMac: clientMac,
          accessDurationMinutes: 60,
        });
        setWelcomeMessage(response.welcomeMessage);
      }
    } catch (err) {
      console.error('Error fetching welcome message', err);
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
        <p className="text-xs text-muted-foreground">Please ensure you are connected to the OmniConnect network to continue.</p>
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
        <h2 className="text-2xl font-bold font-headline">Buy Airtime</h2>
        <p className="text-sm text-muted-foreground">Unlimited internet for 60 minutes.</p>
      </div>

      <div className="bg-accent/30 p-4 rounded-xl border border-accent flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-accent-foreground">Standard Pass</span>
          <p className="text-sm font-semibold">1 Hour High Speed</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-primary">KES 50</p>
        </div>
      </div>

      <div className="pt-2">
        <PaystackButton
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
          {...componentProps}
        />
      </div>
    </div>
  );
}
