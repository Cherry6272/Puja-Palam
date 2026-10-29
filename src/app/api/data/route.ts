import { NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [products, rituals, festivals, orders, customers, stats, dbStatus] = await Promise.all([
      serverRepository.getProducts(),
      serverRepository.getRituals(),
      serverRepository.getFestivals(),
      serverRepository.getOrders(),
      serverRepository.getCustomers(),
      serverRepository.getOperationalStats(),
      serverRepository.getDbStatus(),
    ]);

    return NextResponse.json({
      success: true,
      products,
      rituals,
      festivals,
      orders,
      customers,
      stats,
      dbStatus,
    });
  } catch (error: any) {
    console.error('API /api/data error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch catalogue data' },
      { status: 500 }
    );
  }
}

