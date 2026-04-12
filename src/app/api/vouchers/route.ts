import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Voucher from '@/models/Voucher';
import Package from '@/models/Package';
import { withTenantProtection, addTenantFilter, TenantContext } from '@/lib/tenantMiddleware';

function generateVoucherCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function generateUniqueVoucherCode(): Promise<string> {
  let code: string;
  let isUnique = false;
  
  do {
    code = generateVoucherCode();
    const existing = await Voucher.findOne({ code });
    if (!existing) {
      isUnique = true;
    }
  } while (!isUnique);
  
  return code!;
}

export async function GET(req: Request) {
  return withTenantProtection(async (req: Request, context: TenantContext) => {
    try {
      await dbConnect();
      
      const filter = addTenantFilter({}, context);
      const vouchers = await Voucher.find(filter)
        .populate('package_id', 'name price duration_mins data_limit_gb is_unlimited')
        .populate('ownerId', 'name email')
        .sort({ created_at: -1 });
      
      return NextResponse.json({ success: true, data: vouchers });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  })(req as any);
}

export async function POST(req: Request) {
  return withTenantProtection(async (req: Request, context: TenantContext) => {
    try {
      await dbConnect();
      const { package_id, quantity = 1, created_by } = await req.json();

      if (!package_id || !created_by) {
        return NextResponse.json({ 
          success: false, 
          error: 'Package ID and created_by are required' 
        }, { status: 400 });
      }

      // Verify package belongs to the same tenant
      const packageFilter = addTenantFilter({ _id: package_id }, context);
      const packageData = await Package.findOne(packageFilter);
      if (!packageData) {
        return NextResponse.json({ 
          success: false, 
          error: 'Package not found or access denied' 
        }, { status: 404 });
      }

      const vouchers = [];
      for (let i = 0; i < quantity; i++) {
        const code = await generateUniqueVoucherCode();
        const voucher = new Voucher({
          code,
          package_id,
          created_by,
          ownerId: context.ownerId,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
        });
        await voucher.save();
        vouchers.push(voucher);
      }

      return NextResponse.json({ success: true, data: vouchers }, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
  })(req as any);
}
