import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProductByHandle, getProducts } from '@/lib/shopify';
import ProductDetail from '@/components/ProductDetail';
import PDPSkeleton from '@/components/PDPSkeleton';
import ErrorBoundary from '@/components/ErrorBoundary';

export const revalidate = 60;

export async function generateStaticParams() {
  const { products } = await getProducts(50);
  return products.map((product) => ({
    handle: product.handle,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return { title: 'Product Not Found — GFS Outpost' };
  }

  const image = product.images.edges[0]?.node;

  return {
    title: `${product.title} — GFS Outpost`,
    description: product.description?.slice(0, 160) || `${product.title}. Coldwater surf goods from Station 45°N.`,
    openGraph: {
      title: `${product.title} — GFS Outpost`,
      description: product.description?.slice(0, 160) || `${product.title}. Coldwater surf goods from Station 45°N.`,
      images: image ? [{ url: image.url, width: image.width, height: image.height, alt: image.altText || product.title }] : [],
      type: 'website',
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const images = product.images.edges.map((e) => e.node);
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
  const collection = product.collections.edges[0]?.node.title || product.productType || 'Goods';
  const hasVariants = product.variants.edges.length > 1;
  const anyAvailable = product.variants.edges.some((v) => v.node.availableForSale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || `${product.title}. Coldwater surf goods from Station 45°N.`,
    image: images.map((img) => img.url),
    brand: {
      '@type': 'Brand',
      name: 'Ghost Forest Surf Club',
    },
    ...(product.onlineStoreUrl && { url: product.onlineStoreUrl }),
    offers: hasVariants
      ? {
          '@type': 'AggregateOffer',
          lowPrice: price.toFixed(2),
          highPrice: maxPrice.toFixed(2),
          priceCurrency: product.priceRange.minVariantPrice.currencyCode,
          availability: anyAvailable
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          offerCount: product.variants.edges.length,
        }
      : {
          '@type': 'Offer',
          price: price.toFixed(2),
          priceCurrency: product.priceRange.minVariantPrice.currencyCode,
          availability: anyAvailable
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
  };

  return (
    <Suspense fallback={<PDPSkeleton />}>
      <ErrorBoundary>
        <main className="min-h-screen bg-linen pb-20 md:pb-0">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {/* Top nav bar */}
          <nav className="border-b-[2.5px] border-forest bg-forest/[0.03]">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
              <Link
                href="/"
                className="font-data text-xs tracking-[0.2em] text-forest/70 uppercase hover:text-copper transition-colors"
              >
                &larr; Back to Outpost
              </Link>
              <span className="font-data text-xs tracking-[0.25em] text-forest/40 uppercase">
                GFS Outpost
              </span>
            </div>
          </nav>

          <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
            {/* Section header */}
            <div className="mb-8 border-b-[2.5px] border-forest pb-3">
              <h1 className="font-data text-xs tracking-[0.3em] text-forest/50 uppercase">
                Inventory Detail
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Image column */}
              <div className="space-y-3">
                {images[0] ? (
                  <div className="border-[2.5px] border-forest overflow-hidden bg-sage/10">
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={images[0].url}
                        alt={images[0].altText || product.title}
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

                {/* Data bar under image */}
                <div className="bg-forest px-4 py-2.5">
                  <p className="font-data text-xs tracking-[0.15em] text-linen/90 uppercase">
                    No. 001
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
                    {images.slice(1, 5).map((img, i) => (
                      <div
                        key={i}
                        className="border-[2px] border-forest/30 overflow-hidden bg-sage/10"
                      >
                        <div className="relative aspect-square">
                          <Image
                            src={img.url}
                            alt={img.altText || `${product.title} - image ${i + 2}`}
                            fill
                            sizes="(max-width: 768px) 25vw, 12vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Detail column */}
              <div className="space-y-6">
                {/* Product title */}
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest leading-tight">
                    {product.title}
                  </h2>
                  {product.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="font-data text-xs tracking-[0.15em] text-forest/50 uppercase border border-forest/20 px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Detail grid */}
                <div className="border-[2.5px] border-forest">
                  <div className="bg-forest px-4 py-2">
                    <h3 className="font-data text-xs tracking-[0.25em] text-linen/80 uppercase">
                      Field Report
                    </h3>
                  </div>
                  <div className="divide-y divide-forest/15">
                    <DetailRow label="Item No." value="001" />
                    <DetailRow label="Category" value={collection} />
                    <DetailRow
                      label="Unit Price"
                      value={
                        hasVariants && maxPrice !== price
                          ? `$${Math.round(price)}\u2013$${Math.round(maxPrice)}`
                          : `$${price.toFixed(2)}`
                      }
                      highlight
                    />
                    <DetailRow label="Origin" value="Oregon Coast" />
                    <DetailRow
                      label="Status"
                      value={anyAvailable ? 'In Stock' : 'Out of Stock'}
                      status={anyAvailable ? 'available' : 'unavailable'}
                    />
                    {product.productType && (
                      <DetailRow label="Type" value={product.productType} />
                    )}
                  </div>
                </div>

                {/* Interactive variant selector + CTA + sticky mobile bar */}
                <ErrorBoundary>
                  <ProductDetail
                    variants={product.variants.edges}
                    shopifyUrl={product.onlineStoreUrl}
                    initialPrice={price}
                    hasVariants={hasVariants}
                  />
                </ErrorBoundary>

                {/* Description / Dispatch Notes */}
                {product.description && (
                  <div>
                    <h3 className="font-data text-xs tracking-[0.25em] text-forest/50 uppercase mb-3 pb-2 border-b border-forest/15">
                      Dispatch Notes
                    </h3>
                    {product.descriptionHtml ? (
                      <div
                        className="font-body text-sm text-forest/80 leading-relaxed prose prose-sm max-w-none prose-headings:font-data prose-headings:text-forest prose-strong:text-forest"
                        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                      />
                    ) : (
                      <p className="font-body text-sm text-forest/80 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Secondary info */}
                <p className="font-data text-xs tracking-[0.15em] text-forest/30 uppercase">
                  All orders fulfilled via Ghost Forest Surf Club Shopify.
                  Free shipping on orders over $150.
                </p>
              </div>
            </div>
          </div>
        </main>
      </ErrorBoundary>
    </Suspense>
  );
}

function DetailRow({
  label,
  value,
  highlight,
  status,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  status?: 'available' | 'unavailable';
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="font-data text-xs tracking-[0.2em] text-forest/50 uppercase">
        {label}
      </span>
      <span
        className={`font-data text-xs tracking-wider text-right ${
          highlight
            ? 'text-copper font-medium'
            : status === 'available'
              ? 'text-forest font-medium'
              : status === 'unavailable'
                ? 'text-red-700/70 font-medium'
                : 'text-forest/80'
        }`}
      >
        {status === 'available' && (
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600 mr-2 align-middle" />
        )}
        {value}
      </span>
    </div>
  );
}
