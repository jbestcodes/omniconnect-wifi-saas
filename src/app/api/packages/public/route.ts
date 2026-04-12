import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Package from '@/models/Package';

export async function GET() {
  try {
    await dbConnect();
    
    // Only return active packages for public access
    const packages = await Package.find({ 
      is_active: true 
    })
    .populate('ownerId', 'name businessName')
    .sort({ price: 1 });
    
    return NextResponse.json({ success: true, data: packages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
