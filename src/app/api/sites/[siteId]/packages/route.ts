import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Package from '@/models/Package';
import User, { UserRole } from '@/models/User';

export async function GET(
  req: Request,
  { params }: { params: { siteId: string } }
) {
  try {
    await dbConnect();
    
    const { siteId } = params;
    
    // Find the business owner by siteId
    const owner = await User.findOne({
      siteId,
      role: UserRole.BUSINESS_OWNER,
      isActive: true
    });
    
    if (!owner) {
      return NextResponse.json({ 
        success: false, 
        error: 'Site not found' 
      }, { status: 404 });
    }
    
    // Get packages for this specific owner
    const packages = await Package.find({ 
      ownerId: owner._id,
      is_active: true 
    }).sort({ price: 1 });
    
    return NextResponse.json({ success: true, data: packages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
