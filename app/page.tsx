import { getProducts, getCollections } from '@/lib/shopify';
import { ShopifyProduct, ShopifyCollection } from '@/types/shopify';
import FeedLayout from '@/components/FeedLayout';
import HeroSection from '@/components/HeroSection';
import ErrorBoundary from '@/components/ErrorBoundary';

export const revalidate = 60;

export default async function Home() {
  let products: ShopifyProduct[] = [];
  let collections: ShopifyCollection[] = [];
  let fetchError = false;

  try {
    const [productsData, collectionsData] = await Promise.all([
      getProducts(50),
      getCollections(),
    ]);
    products = productsData.products;
    collections = collectionsData;
    if (products.length === 0) {
      console.warn('[GFS Outpost] Shopify returned zero products');
    }
  } catch (error) {
    fetchError = true;
    console.error('[GFS Outpost] Failed to fetch from Shopify:', error);
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
      {fetchError ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ color: '#D4A04A', fontSize: '20px', marginBottom: '16px' }}>&#9679;</div>
          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.25rem',
              color: '#1B3A2D',
              marginBottom: '12px',
            }}
          >
            Outpost temporarily unavailable
          </h2>
          <p
            style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: '0.875rem',
              color: '#4A5568',
              maxWidth: '20rem',
              lineHeight: '1.6',
            }}
          >
            We&apos;re having trouble loading the goods. Please refresh to try again.
          </p>
        </div>
      ) : (
        <FeedLayout initialProducts={products} collections={collections} />
      )}
    </>
  );
}
