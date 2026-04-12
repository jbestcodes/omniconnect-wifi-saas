import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Voucher from '@/models/Voucher';
import { authorizeUser } from '@/lib/omada';

export async function POST(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    await dbConnect();
    const { clientMac } = await req.json();

    if (!clientMac) {
      return NextResponse.json({ 
        success: false, 
        error: 'Client MAC address is required' 
      }, { status: 400 });
    }

    const voucher = await Voucher.findOne({ 
      code: params.code.toUpperCase(),
      status: 'unused'
    }).populate('package_id');

    if (!voucher) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or already used voucher' 
      }, { status: 404 });
    }

    const packageData = voucher.package_id as any;
    
    // Update voucher status
    await Voucher.findByIdAndUpdate(voucher._id, {
      status: 'active',
      client_mac: clientMac,
      used_at: new Date(),
    });

    // Authorize user on Omada Controller
    try {
      await authorizeUser(clientMac, packageData.duration_mins);
    } catch (err) {
      console.error('Failed to authorize via Omada API', err);
      // Revert voucher status on failure
      await Voucher.findByIdAndUpdate(voucher._id, {
        status: 'unused',
        client_mac: undefined,
        used_at: undefined,
      });
      throw err;
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        voucher: voucher.code,
        package: packageData.name,
        duration: packageData.duration_mins,
        data_limit: packageData.is_unlimited ? 'Unlimited' : `${packageData.data_limit_gb} GB`,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to use voucher' 
    }, { status: 500 });
  }
}
