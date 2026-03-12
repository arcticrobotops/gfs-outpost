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

/** Full product detail returned by getProductByHandle (includes description, variants, etc.) */
export interface ShopifyProductDetail extends ShopifyProduct {
  description: string;
  descriptionHtml: string;
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: ShopifyPrice;
        selectedOptions: Array<{ name: string; value: string }>;
      };
    }>;
  };
}
