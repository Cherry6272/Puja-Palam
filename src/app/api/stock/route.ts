import { NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { id, hub, delta } = await req.json();
    if (!id || !hub || typeof delta !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid stock update params' }, { status: 400 });
    }

    const updated = await serverRepository.updateProductStock(id, hub, delta);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
