import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-linen flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        {/* Data bar header */}
        <div className="bg-forest text-linen px-4 py-3 flex items-center justify-between mb-0">
          <span className="font-data text-xs tracking-[0.25em] uppercase">
            Item Status
          </span>
          <span className="font-data text-xs tracking-[0.2em] text-copper">
            ERROR
          </span>
        </div>
        <div className="border-[2.5px] border-forest border-t-0 px-6 py-10 text-center">
          <p className="font-data text-[72px] leading-none text-forest/10 font-bold mb-2">
            404
          </p>
          <h1 className="font-display text-xl text-forest uppercase tracking-wider mb-4">
            Item Not Found
          </h1>
          <div className="h-px bg-forest/10 mb-4" />
          <p className="font-data text-xs tracking-[0.12em] text-slate leading-relaxed mb-8">
            This item does not exist in the outpost inventory. The handle may be incorrect or the item has been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-data text-xs tracking-[0.2em] uppercase text-forest hover:text-copper transition-colors min-h-[44px]"
          >
            &larr; Return to Inventory
          </Link>
        </div>
      </div>
    </main>
  );
}
