import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User, { UserRole } from '@/models/User';
import { withSuperAdminProtection, TenantContext } from '@/lib/tenantMiddleware';

export async function GET(req: Request) {
  return withSuperAdminProtection(async (req: Request, context: TenantContext) => {
    try {
      await dbConnect();
      
      const businessOwners = await User.find({
        role: UserRole.BUSINESS_OWNER
      })
      .select('name email businessName siteId isActive whatsappNumber paystackSubaccountCode createdAt')
      .sort({ createdAt: -1 });
      
      return NextResponse.json({ success: true, data: businessOwners });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  })(req as any);
}
