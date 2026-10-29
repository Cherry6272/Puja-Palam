import { NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const festivals = await serverRepository.getFestivals();
    return NextResponse.json({ success: true, festivals });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const festival = await req.json();
    if (!festival || !festival.id || !festival.name) {
      return NextResponse.json({ success: false, error: 'Invalid festival data' }, { status: 400 });
    }
    await serverRepository.saveFestival(festival);
    return NextResponse.json({ success: true, festival });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

