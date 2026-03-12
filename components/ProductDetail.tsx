'use client';

import { useState } from 'react';

interface Variant {
  node: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface ProductDetailProps {
  variants: Variant[];
  shopifyUrl: string | null;
  initialPrice: number;
  hasVariants: boolean;
}

export default function ProductDetail({
  variants,
  shopifyUrl,
  initialPrice,
  hasVariants,
}: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    variants.find((v) => v.node.availableForSale)?.node.id || null,
  );

  const selected = variants.find((v) => v.node.id === selectedVariant);
  const currentPrice = selected
    ? parseFloat(selected.node.price.amount)
    : initialPrice;
  const isAvailable = selected?.node.availableForSale ?? false;

  return (
    <div className="space-y-6">
      {/* Interactive variant selector */}
      {hasVariants && (
        <div className="border-[2.5px] border-forest/30">
          <div className="bg-forest/5 px-4 py-2 border-b border-forest/15">
            <h3 className="font-data text-xs tracking-[0.15em] sm:tracking-[0.25em] text-forest/60 uppercase">
              Select Option
            </h3>
          </div>
          <div className="px-4 py-3 flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.node.id}
                onClick={() => {
                  if (v.node.availableForSale) {
                    setSelectedVariant(v.node.id);
                  }
                }}
                disabled={!v.node.availableForSale}
                className={`font-data text-xs tracking-wider px-4 py-2 border transition-colors duration-150 ${
                  v.node.id === selectedVariant
                    ? 'border-copper bg-copper/10 text-copper font-medium'
                    : v.node.availableForSale
                      ? 'border-forest/30 text-forest/80 hover:border-forest hover:bg-forest/5 cursor-pointer'
                      : 'border-forest/10 text-forest/30 line-through cursor-not-allowed'
                }`}
              >
                {v.node.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic price display */}
      <div className="flex items-baseline gap-3">
        <span className="font-data text-lg tracking-wider text-copper font-medium">
          ${currentPrice.toFixed(2)}
        </span>
        {!isAvailable && selectedVariant && (
          <span className="font-data text-xs tracking-wider text-red-700/70 uppercase">
            Unavailable
          </span>
        )}
      </div>

      {/* CTA */}
      {shopifyUrl && (
        <a
          href={shopifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full font-data text-xs tracking-[0.15em] sm:tracking-[0.25em] uppercase text-center py-4 border-[2.5px] transition-colors duration-200 ${
            isAvailable
              ? 'bg-forest text-linen border-forest hover:bg-copper hover:border-copper'
              : 'bg-forest/20 text-forest/40 border-forest/20 cursor-not-allowed pointer-events-none'
          }`}
        >
          {isAvailable ? 'Requisition' : 'Currently Unavailable'}
        </a>
      )}

      {/* Sticky mobile CTA */}
      {shopifyUrl && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-linen border-t-[2.5px] border-forest px-4 py-4 flex items-center gap-3 safe-area-bottom">
          <div className="flex-1 min-w-0">
            <p className="font-data text-xs tracking-wider text-forest/60 uppercase max-w-[180px] truncate">
              {isAvailable ? 'Ready to ship' : 'Unavailable'}
            </p>
            <p className="font-data text-sm tracking-wider text-copper font-medium">
              ${currentPrice.toFixed(2)}
            </p>
          </div>
          <a
            href={shopifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`shrink-0 font-data text-xs tracking-[0.1em] sm:tracking-[0.2em] uppercase px-6 py-3 border-[2px] transition-colors duration-200 ${
              isAvailable
                ? 'bg-forest text-linen border-forest hover:bg-copper hover:border-copper'
                : 'bg-forest/20 text-forest/40 border-forest/20 pointer-events-none'
            }`}
          >
            {isAvailable ? 'Requisition' : 'Unavailable'}
          </a>
        </div>
      )}
    </div>
  );
}
