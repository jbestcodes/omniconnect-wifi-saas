import { NextResponse } from 'next/server';
import { getTenantContext } from '@/lib/tenantMiddleware';

export async function GET(req: Request) {
  try {
    const context = await getTenantContext(req);
    
    if (!context) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: context.user._id,
          name: context.user.name,
          email: context.user.email,
          role: context.user.role,
          siteId: context.user.siteId,
        },
        isSuperAdmin: context.isSuperAdmin,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
