import { NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rituals = await serverRepository.getRituals();
    return NextResponse.json({ success: true, rituals });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const ritual = await req.json();
    if (!ritual || !ritual.id || !ritual.name) {
      return NextResponse.json({ success: false, error: 'Invalid ritual data' }, { status: 400 });
    }
    await serverRepository.saveRitual(ritual);
    return NextResponse.json({ success: true, ritual });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
