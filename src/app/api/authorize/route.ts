
import { NextResponse } from 'next/server';
import { authorizeUser } from '@/lib/omada';

export async function POST(req: Request) {
  try {
    const { clientMac, durationMinutes } = await req.json();

    if (!clientMac) {
      return NextResponse.json({ error: 'Client MAC is required' }, { status: 400 });
    }

    const result = await authorizeUser(clientMac, durationMinutes || 60);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Authorization failed' }, { status: 500 });
  }
}
