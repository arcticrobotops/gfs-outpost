export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  productType: string;
  tags: string[];
  onlineStoreUrl: string | null;
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  collections: {
    edges: Array<{
      node: {
        title: string;
        handle: string;
      };
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
}

// Feed card types
export type FeedCardType = 'product' | 'editorial' | 'text-moment';

export interface ProductCard {
  type: 'product';
  product: ShopifyProduct;
}

export interface EditorialCard {
  type: 'editorial';
  imageUrl: string;
  alt: string;
}

export interface TextMomentCard {
  type: 'text-moment';
  text: string;
  bgColor: 'green' | 'linen';
}

export type FeedCard = ProductCard | EditorialCard | TextMomentCard;

// Grid layout pattern
export interface GridSpan {
  colSpan: number;
  rowSpan: number;
}
