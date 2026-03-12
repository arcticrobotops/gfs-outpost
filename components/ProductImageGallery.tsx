'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  title: string;
  itemNo: string;
  collection: string;
  price: number;
  maxPrice: number;
  hasVariants: boolean;
}

export default function ProductImageGallery({
  images,
  title,
  itemNo,
  collection,
  price,
  maxPrice,
  hasVariants,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-3">
      {/* Main image */}
      {selectedImage ? (
        <div className="border-[2.5px] border-forest overflow-hidden bg-sage/10">
          <div className="relative aspect-[3/4]">
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      ) : (
        <div className="border-[2.5px] border-forest aspect-[3/4] flex items-center justify-center bg-sage/10">
          <span className="font-data text-xs tracking-widest text-sage uppercase">
            No Image
          </span>
        </div>
      )}

      {/* Data bar */}
      <div className="bg-forest px-4 py-2.5">
        <p className="font-data text-xs tracking-[0.15em] text-linen/90 uppercase">
          No. {itemNo}
          <span className="mx-2 text-copper/60">|</span>
          {collection}
          <span className="mx-2 text-copper/60">|</span>
          <span className="text-copper font-medium">
            ${Math.round(price)}
            {hasVariants && maxPrice !== price && `\u2013$${Math.round(maxPrice)}`}
          </span>
        </p>
      </div>

      {/* Thumbnail row */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`border-[2px] overflow-hidden bg-sage/10 transition-colors ${
                i === selectedIndex
                  ? 'border-copper'
                  : 'border-forest/30 hover:border-forest'
              }`}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === selectedIndex}
            >
              <div className="relative aspect-square">
                <Image
                  src={img.url}
                  alt={img.altText || `${title} - image ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 25vw, 12vw"
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
