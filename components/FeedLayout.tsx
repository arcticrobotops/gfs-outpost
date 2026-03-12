'use client';

import { useState, useEffect } from 'react';
import { ShopifyProduct, ShopifyCollection } from '@/types/shopify';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import EditorialCard, { getEditorialByIndex } from './EditorialCard';
import TextMoment, { getTextMomentByIndex } from './TextMoment';
import ErrorBoundary from './ErrorBoundary';

interface FeedLayoutProps {
  initialProducts: ShopifyProduct[];
  collections: ShopifyCollection[];
}

export default function FeedLayout({
  initialProducts,
  collections,
}: FeedLayoutProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>(initialProducts);
  const [activeCollection, setActiveCollection] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiltered = async (collection: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/products?collection=${encodeURIComponent(collection)}`,
      );
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load products',
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeCollection === 'all') {
      setProducts(initialProducts);
      setError(null);
      return;
    }

    fetchFiltered(activeCollection);
  }, [activeCollection, initialProducts]);

  // Build the feed: interleave products with editorials and text moments
  const feedItems: React.ReactNode[] = [];
  let editorialCount = 0;
  let textMomentCount = 0;

  products.forEach((product, i) => {
    if (i > 0 && i % 4 === 0) {
      const editorial = getEditorialByIndex(editorialCount);
      feedItems.push(
        <div key={`editorial-${editorialCount}`} className="feed-item">
          <ErrorBoundary>
            <EditorialCard
              imageUrl={editorial.imageUrl}
              alt={editorial.alt}
              caption={editorial.caption}
            />
          </ErrorBoundary>
        </div>,
      );
      editorialCount++;
    }

    if (i > 0 && i % 7 === 0) {
      const moment = getTextMomentByIndex(textMomentCount);
      feedItems.push(
        <div key={`moment-${textMomentCount}`} className="feed-item">
          <ErrorBoundary>
            <TextMoment
              header={moment.header}
              body={moment.body}
              variant={moment.variant}
            />
          </ErrorBoundary>
        </div>,
      );
      textMomentCount++;
    }

    feedItems.push(
      <div key={product.id} className="feed-item">
        <ErrorBoundary>
          <ProductCard product={product} />
        </ErrorBoundary>
      </div>,
    );
  });

  return (
    <div className="min-h-screen bg-linen">
      <ErrorBoundary>
        <Navbar
          collections={collections}
          activeCollection={activeCollection}
          onCollectionChange={setActiveCollection}
        />
      </ErrorBoundary>

      <main id="inventory" className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        {/* Page header */}
        <div className="mb-8 text-center">
          <div className="flex items-center gap-3 justify-center mb-3">
            <div className="h-px w-8 sm:w-12 bg-copper" />
            <p className="font-data text-xs tracking-[0.15em] sm:tracking-[0.25em] text-copper uppercase">
              Station 45&deg;N Inventory
            </p>
            <div className="h-px w-8 sm:w-12 bg-copper" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-forest tracking-wide">
            Current Stock
          </h2>
          <div className="mt-3 mx-auto w-12 h-px bg-forest/20" />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="border-[2.5px] border-forest p-6 sm:p-8">
            <p className="font-data text-xs tracking-[0.15em] sm:tracking-[0.25em] text-copper uppercase mb-6 text-center animate-pulse">
              Transmitting...
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border border-forest/20">
                  <div className="aspect-[3/4] bg-sage/10 animate-pulse" />
                  <div className="bg-forest/5 px-3 py-2">
                    <div className="h-2.5 bg-forest/10 rounded-sm w-3/4" />
                  </div>
                  <div className="px-3 py-3">
                    <div className="h-3 bg-forest/10 rounded-sm w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 border-[2.5px] border-red-700/30">
            <div className="w-8 h-8 mb-4 flex items-center justify-center border-2 border-red-700/40 rounded-full">
              <span className="text-red-700 font-data text-sm font-bold">!</span>
            </div>
            <p className="font-data text-xs tracking-[0.1em] sm:tracking-[0.2em] text-red-700/70 uppercase mb-2">
              Signal Lost
            </p>
            <p className="font-body text-sm text-slate mb-6">
              {error}
            </p>
            <button
              onClick={() => fetchFiltered(activeCollection)}
              className="font-data text-xs tracking-[0.15em] sm:tracking-[0.25em] uppercase px-6 py-2.5 border-[2px] border-forest text-forest hover:bg-forest hover:text-linen transition-colors duration-200"
            >
              Retry Transmission
            </button>
          </div>
        )}

        {/* Feed grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {feedItems}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="font-data text-xs tracking-[0.1em] sm:tracking-[0.2em] text-sage uppercase mb-2">
              No items found
            </p>
            <p className="font-body text-sm text-slate">
              Check back soon for new inventory.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
