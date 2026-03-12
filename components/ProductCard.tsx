import Image from 'next/image';
import Link from 'next/link';
import { ShopifyProduct } from '@/types/shopify';

const BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+PHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPScjRjVGMEU4Jy8+PC9zdmc+';

interface ProductCardProps {
  product: ShopifyProduct;
  index: number;
}

function hashHandle(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const collection =
    product.collections.edges[0]?.node.title || product.productType || 'Goods';
  const itemNo = String((hashHandle(product.handle) % 999) + 1).padStart(3, '0');

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
    >
      <article className="border-[2.5px] border-forest bg-linen transition-[color,box-shadow] duration-200 group-hover:border-copper group-hover:shadow-[0_4px_16px_rgba(27,58,45,0.12)] overflow-hidden">
        {/* Product image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-sage/10">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
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
        <div className="bg-forest px-3 py-2.5 overflow-hidden">
          <p className="font-data text-[13px] tracking-[0.1em] sm:tracking-[0.15em] text-linen/90 uppercase whitespace-nowrap overflow-hidden text-ellipsis">
            No. {itemNo}
            <span className="mx-1.5 text-copper/60">|</span>
            <span className="truncate">{collection}</span>
            <span className="mx-1.5 text-copper/60">|</span>
            <span className="text-copper font-medium">${Math.round(price)}</span>
          </p>
        </div>

        {/* Product title */}
        <div className="px-3 py-3">
          <h3 className="font-body text-sm font-medium text-forest leading-snug line-clamp-2">
            {product.title}
          </h3>
        </div>
      </article>
    </Link>
  );
}
