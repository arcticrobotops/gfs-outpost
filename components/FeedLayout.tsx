'use client';

import { useState, useEffect } from 'react';
import { ShopifyProduct, ShopifyCollection } from '@/types/shopify';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import EditorialCard, { getEditorialByIndex } from './EditorialCard';
import TextMoment, { getTextMomentByIndex } from './TextMoment';
import Footer from './Footer';

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

  useEffect(() => {
    if (activeCollection === 'all') {
      setProducts(initialProducts);
      return;
    }

    async function fetchFiltered() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products?collection=${encodeURIComponent(activeCollection)}`,
        );
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        setProducts(initialProducts);
      } finally {
        setLoading(false);
      }
    }

    fetchFiltered();
  }, [activeCollection, initialProducts]);

  // Build the feed: interleave products with editorials and text moments
  const feedItems: React.ReactNode[] = [];
  let editorialCount = 0;
  let textMomentCount = 0;

  products.forEach((product, i) => {
    // Insert editorial every 4 products
    if (i > 0 && i % 4 === 0) {
      const editorial = getEditorialByIndex(editorialCount);
      feedItems.push(
        <div key={`editorial-${editorialCount}`} className="feed-item">
          <EditorialCard
            imageUrl={editorial.imageUrl}
            alt={editorial.alt}
            caption={editorial.caption}
          />
        </div>,
      );
      editorialCount++;
    }

    // Insert text moment every 7 products
    if (i > 0 && i % 7 === 0) {
      const moment = getTextMomentByIndex(textMomentCount);
      feedItems.push(
        <div key={`moment-${textMomentCount}`} className="feed-item">
          <TextMoment
            header={moment.header}
            body={moment.body}
            variant={moment.variant}
          />
        </div>,
      );
      textMomentCount++;
    }

    feedItems.push(
      <div key={product.id} className="feed-item">
        <ProductCard product={product} index={i} />
      </div>,
    );
  });

  return (
    <div className="min-h-screen bg-linen">
      <Navbar
        collections={collections}
        activeCollection={activeCollection}
        onCollectionChange={setActiveCollection}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        {/* Page header */}
        <div className="mb-8 text-center">
          <p className="font-data text-[10px] tracking-[0.25em] text-copper uppercase mb-2">
            Station 45&deg;N Inventory
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-forest tracking-wide">
            Current Stock
          </h2>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="border-[2.5px] border-forest p-6 sm:p-8">
            <p className="font-data text-[10px] tracking-[0.25em] text-copper uppercase mb-6 text-center animate-pulse">
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

        {/* Feed grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {feedItems}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="font-data text-xs tracking-[0.2em] text-sage uppercase mb-2">
              No items found
            </p>
            <p className="font-body text-sm text-slate">
              Check back soon for new inventory.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
