'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, WifiOff, MessageCircle } from 'lucide-react';

export default function LandingContentMinimal() {
  const searchParams = useSearchParams();
  const [clientMac] = useState<string | null>(searchParams.get('clientMac'));
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success'>('idle');

  const packages = [
    { id: 'basic', name: 'Basic Pass', price: 50, duration: '1 hour' },
    { id: 'standard', name: 'Standard Pass', price: 100, duration: '2 hours' },
    { id: 'premium', name: 'Premium Pass', price: 200, duration: '4 hours' },
  ];

  const handlePayment = () => {
    setPaymentStatus('success');
    setTimeout(() => {
      window.location.href = "https://google.com";
    }, 3000);
  };

  if (!clientMac) {
    return (
      <div className="text-center py-6">
        <WifiOff className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <p className="text-sm text-red-500 font-medium">MAC Address Required</p>
        <p className="text-xs text-gray-500">Add ?clientMac=XX:XX:XX:XX:XX:XX to URL</p>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="text-center space-y-4 py-4">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
        <h3 className="text-xl font-bold">Access Granted!</h3>
        <p className="text-sm text-gray-600">Redirecting to internet...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Badge variant="secondary" className="mb-2">Device: {clientMac}</Badge>
        <h2 className="text-2xl font-bold">Internet Access</h2>
        <p className="text-sm text-gray-600">Choose your plan</p>
      </div>

      <div className="space-y-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedPackage === pkg.id
                ? 'bg-blue-50 border-blue-500'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{pkg.name}</span>
                <p className="text-sm text-gray-600">{pkg.duration}</p>
              </div>
              <span className="font-bold text-lg">KES {pkg.price}</span>
            </div>
          </div>
        ))}
      </div>

      <Button
        className="w-full"
        onClick={handlePayment}
      >
        Pay KES {packages.find(p => p.id === selectedPackage)?.price} (Test)
      </Button>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => window.open('https://wa.me/254799590637', '_blank')}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Contact Support
      </Button>

      <div className="text-center">
        <Badge variant="outline" className="text-xs">
          Test Mode - No Real Payments
        </Badge>
      </div>
    </div>
  );
}
