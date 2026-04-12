import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Package from '@/models/Package';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const packageData = await Package.findById(params.id);
    
    if (!packageData) {
      return NextResponse.json({ success: false, error: 'Package not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: packageData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const packageData = await Package.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!packageData) {
      return NextResponse.json({ success: false, error: 'Package not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: packageData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const packageData = await Package.findByIdAndDelete(params.id);
    
    if (!packageData) {
      return NextResponse.json({ success: false, error: 'Package not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Package deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
