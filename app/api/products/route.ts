import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/shopify';

const COLLECTION_HANDLE_PATTERN = /^[a-zA-Z0-9-]+$/;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const collection = searchParams.get('collection') || undefined;

  // Validate collection handle format
  if (collection && !COLLECTION_HANDLE_PATTERN.test(collection)) {
    return NextResponse.json(
      { error: 'Invalid collection handle', products: [] },
      { status: 400 }
    );
  }

  try {
    const data = await getProducts(50, undefined, collection);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', products: [] },
      { status: 500 }
    );
  }
}
