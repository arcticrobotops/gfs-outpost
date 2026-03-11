import Image from 'next/image';
import { ShopifyProduct } from '@/types/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const collection =
    product.collections.edges[0]?.node.title || product.productType || 'Goods';
  const itemNo = String(index + 1).padStart(3, '0');

  return (
    <a
      href={product.onlineStoreUrl || `#${product.handle}`}
      target={product.onlineStoreUrl ? '_blank' : undefined}
      rel={product.onlineStoreUrl ? 'noopener noreferrer' : undefined}
      className="group block"
    >
      <article className="border-[2.5px] border-forest bg-linen transition-colors duration-200 group-hover:border-copper overflow-hidden">
        {/* Product image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-sage/10">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-data text-xs tracking-widest text-sage uppercase">
                No Image
              </span>
            </div>
          )}
        </div>

        {/* Data bar */}
        <div className="bg-forest px-3 py-2 overflow-hidden">
          <p className="font-data text-[10px] tracking-[0.15em] text-linen/90 uppercase whitespace-nowrap overflow-hidden text-ellipsis">
            No. {itemNo}
            <span className="mx-1.5 text-copper/60">|</span>
            <span className="truncate">{collection}</span>
            <span className="mx-1.5 text-copper/60">|</span>
            <span className="text-copper font-medium">${Math.round(price)}</span>
          </p>
        </div>

        {/* Product title */}
        <div className="px-3 py-3">
          <h3 className="font-body text-sm font-medium text-forest leading-snug">
            {product.title}
          </h3>
        </div>
      </article>
    </a>
  );
}
