import { ShopifyProduct, ShopifyProductDetail, ShopifyCollection } from '@/types/shopify';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const domain = requireEnv('SHOPIFY_STORE_DOMAIN');
const storefrontAccessToken = requireEnv('SHOPIFY_STOREFRONT_ACCESS_TOKEN');

const endpoint = `https://${domain}/api/2024-10/graphql.json`;

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`);
  }

  return json.data;
}

const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query, sortKey: CREATED_AT, reverse: true) {
      edges {
        cursor
        node {
          id
          title
          handle
          productType
          tags
          onlineStoreUrl
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 2) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          collections(first: 5) {
            edges {
              node {
                title
                handle
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query Collections {
    collections(first: 20, sortKey: TITLE) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

export async function getProducts(
  first: number = 50,
  after?: string,
  collectionHandle?: string
): Promise<{
  products: ShopifyProduct[];
  hasNextPage: boolean;
  endCursor: string | null;
}> {
  // Build query filter for collection
  const query = collectionHandle && collectionHandle !== 'all'
    ? `collection:${collectionHandle}`
    : undefined;

  const data = await shopifyFetch<{
    products: {
      edges: Array<{ cursor: string; node: ShopifyProduct }>;
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  }>(PRODUCTS_QUERY, { first, after, query });

  return {
    products: data.products.edges.map((edge) => edge.node),
    hasNextPage: data.products.pageInfo.hasNextPage,
    endCursor: data.products.pageInfo.endCursor,
  };
}

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      productType
      tags
      onlineStoreUrl
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      collections(first: 5) {
        edges {
          node {
            title
            handle
          }
        }
      }
    }
  }
`;

export async function getProductByHandle(handle: string): Promise<ShopifyProductDetail | null> {
  const data = await shopifyFetch<{
    productByHandle: ShopifyProductDetail | null;
  }>(PRODUCT_BY_HANDLE_QUERY, { handle });

  return data.productByHandle;
}

export async function getCollections(): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{
    collections: {
      edges: Array<{ node: ShopifyCollection }>;
    };
  }>(COLLECTIONS_QUERY);

  return data.collections.edges.map((edge) => edge.node);
}
