import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { withSuperAdminProtection, TenantContext } from '@/lib/tenantMiddleware';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  return withSuperAdminProtection(async (req: Request, context: TenantContext) => {
    try {
      await dbConnect();
      
      const { id } = params;
      const body = await req.json();
      
      const updatedOwner = await User.findByIdAndUpdate(
        id,
        body,
        { new: true, runValidators: true }
      ).select('name email businessName siteId isActive whatsappNumber paystackSubaccountCode createdAt');
      
      if (!updatedOwner) {
        return NextResponse.json(
          { success: false, error: 'Business owner not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: updatedOwner });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  })(req as any);
}
