import { getProducts, getCollections } from '@/lib/shopify';
import FeedLayout from '@/components/FeedLayout';
import HeroSection from '@/components/HeroSection';
import ErrorBoundary from '@/components/ErrorBoundary';

export const revalidate = 60;

export default async function Home() {
  let products: any[] = [];
  let collections: any[] = [];

  try {
    const [productsData, collectionsData] = await Promise.all([
      getProducts(50),
      getCollections(),
    ]);
    products = productsData.products;
    collections = collectionsData;
  } catch (error) {
    console.error('Failed to fetch from Shopify:', error);
  }

  return (
    <>
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>
      <FeedLayout initialProducts={products} collections={collections} />
    </>
  );
}
