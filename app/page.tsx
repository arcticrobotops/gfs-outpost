import { getProducts, getCollections } from '@/lib/shopify';
import FeedLayout from '@/components/FeedLayout';

export const revalidate = 60;

export default async function Home() {
  const [{ products }, collections] = await Promise.all([
    getProducts(50),
    getCollections(),
  ]);

  return <FeedLayout initialProducts={products} collections={collections} />;
}
