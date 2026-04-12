
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';
import Package from '@/models/Package';
import User from '@/models/User';
import { authorizeUser } from '@/lib/omada';

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY || '';
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  // Verify Paystack signature
  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');

  if (hash !== signature) {
    console.error('Invalid Paystack signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === 'charge.success') {
    try {
      await dbConnect();
      const { reference, metadata, amount, subaccount } = event.data;
      const clientMac = metadata?.client_mac;
      const packageId = metadata?.package_id;
      const siteId = metadata?.site_id;
      const ownerId = metadata?.owner_id;

      if (!clientMac) {
        console.error('No client MAC address found in metadata');
        return NextResponse.json({ error: 'Client MAC required' }, { status: 400 });
      }

      let packageData = null;
      let durationMinutes = 60; // Default duration
      let packageOwnerId = null;

      // If package_id is provided, fetch package details
      if (packageId) {
        packageData = await Package.findById(packageId).populate('ownerId');
        if (packageData && packageData.is_active) {
          durationMinutes = packageData.duration_mins;
          packageOwnerId = packageData.ownerId._id;
        } else {
          console.warn(`Package ${packageId} not found or inactive, using default duration`);
        }
      }

      // If we have siteId, try to find the business owner
      let businessOwner = null;
      if (siteId && !packageOwnerId) {
        businessOwner = await User.findOne({ siteId, role: 'BUSINESS_OWNER' });
        if (businessOwner) {
          packageOwnerId = businessOwner._id;
        }
      }

      // Update transaction record with complete information
      await Transaction.findOneAndUpdate(
        { reference },
        { 
          status: 'success', 
          paidAt: new Date(), 
          amount: amount / 100,
          clientMac,
          package_id: packageId,
          ownerId: packageOwnerId,
          accessDurationMinutes: durationMinutes,
          subaccount: subaccount || businessOwner?.paystackSubaccountCode
        },
        { upsert: true }
      );

      // Authorize user on Omada Controller with correct duration
      try {
        const authResult = await authorizeUser(clientMac, durationMinutes);
        console.log(`Successfully authorized ${clientMac} for ${durationMinutes} minutes`, authResult);
      } catch (err) {
        console.error('Failed to authorize via Omada API:', err);
        // Don't fail the webhook, but log the error for manual intervention
      }

      return NextResponse.json({ 
        status: 'received',
        message: `Client ${clientMac} authorized for ${durationMinutes} minutes`
      });

    } catch (error: any) {
      console.error('Error processing charge.success webhook:', error);
      return NextResponse.json({ 
        error: 'Processing failed', 
        details: error.message 
      }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 'received' });
}
