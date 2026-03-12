import { getProducts, getCollections } from '@/lib/shopify';
import { ShopifyProduct, ShopifyCollection } from '@/types/shopify';
import FeedLayout from '@/components/FeedLayout';
import HeroSection from '@/components/HeroSection';
import ErrorBoundary from '@/components/ErrorBoundary';

export const revalidate = 60;

export default async function Home() {
  let products: ShopifyProduct[] = [];
  let collections: ShopifyCollection[] = [];

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

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ghost Forest Surf Club',
    url: 'https://ghostforestsurfclub.com',
    description: 'Coldwater surf goods from Station 45\u00b0N. Neskowin, Oregon. Est. 2024.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c') }}
      />
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>
      <FeedLayout initialProducts={products} collections={collections} />
    </>
  );
}
