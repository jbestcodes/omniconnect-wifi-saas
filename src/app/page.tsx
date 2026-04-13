
import { Suspense } from 'react';
import LandingContent from '@/components/LandingContent';
import { Wifi, ShieldCheck, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card shadow-2xl rounded-2xl overflow-hidden border border-border">
        <div className="bg-primary p-8 text-white flex flex-col items-center text-center">
          <div className="bg-white/20 p-4 rounded-full mb-4">
            <Wifi className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-headline font-bold mb-2">WiFi Pay</h1>
          <p className="text-primary-foreground/80 font-medium">Fast, Secure High-Speed Wi-Fi</p>
        </div>

        <div className="p-8">
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <LandingContent />
          </Suspense>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-secondary mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Instant Access</h4>
                <p className="text-xs text-muted-foreground">Connected automatically after successful payment.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-secondary mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Secure Payment</h4>
                <p className="text-xs text-muted-foreground">Powered by Paystack. Your details are safe.</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="p-6 text-center text-xs text-muted-foreground bg-muted/30">
          <p>&copy; {new Date().getFullYear()} OmniConnect Pay. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
