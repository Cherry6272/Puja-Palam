import { NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await serverRepository.getProducts();
    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const product = await req.json();
    if (!product || !product.id || !product.name) {
      return NextResponse.json({ success: false, error: 'Invalid product data' }, { status: 400 });
    }
    await serverRepository.saveProduct(product);
    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return POST(req);
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }
    await serverRepository.deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

