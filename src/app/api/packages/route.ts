import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Package from '@/models/Package';
import { withTenantProtection, addTenantFilter, TenantContext } from '@/lib/tenantMiddleware';

export async function GET(req: Request) {
  return withTenantProtection(async (req: Request, context: TenantContext) => {
    try {
      await dbConnect();
      
      // Filter packages by tenant
      const filter = addTenantFilter({ is_active: true }, context);
      const packages = await Package.find(filter)
        .populate('ownerId', 'name email')
        .sort({ created_at: -1 });
      
      return NextResponse.json({ success: true, data: packages });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  })(req as any);
}

export async function POST(req: Request) {
  return withTenantProtection(async (req: Request, context: TenantContext) => {
    try {
      await dbConnect();
      const body = await req.json();
      
      // Add ownerId to package data
      const packageData = new Package({
        ...body,
        ownerId: context.ownerId,
      });
      
      await packageData.save();
      
      return NextResponse.json({ success: true, data: packageData }, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
  })(req as any);
}
