import { NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await serverRepository.getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.orderId || !body.customer) {
      return NextResponse.json({ success: false, error: 'Invalid order structure' }, { status: 400 });
    }

    const res = await serverRepository.createOrder(body);
    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId: body.orderId });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to place order' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { orderId, boxKey, newStatus } = await req.json();
    if (!orderId || !boxKey || !newStatus) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    await serverRepository.updateOrderBoxStatus(orderId, boxKey, newStatus);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
