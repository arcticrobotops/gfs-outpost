export default function PDPSkeleton() {
  return (
    <main className="min-h-screen bg-linen animate-pulse" aria-busy="true" role="status">
      {/* Top nav skeleton */}
      <nav className="border-b-[2.5px] border-forest/20 bg-forest/[0.03]">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="h-3 w-32 bg-forest/10 rounded-sm" />
          <div className="h-3 w-20 bg-forest/10 rounded-sm" />
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Section header skeleton */}
        <div className="mb-8 border-b-[2.5px] border-forest/10 pb-3">
          <div className="h-3 w-28 bg-forest/10 rounded-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image column */}
          <div className="space-y-3">
            <div className="border-[2.5px] border-forest/10 aspect-[3/4] bg-sage/10" />
            <div className="bg-forest/10 h-10" />
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-sage/10 border border-forest/10" />
              ))}
            </div>
          </div>

          {/* Detail column */}
          <div className="space-y-6">
            <div>
              <div className="h-8 w-3/4 bg-forest/10 rounded-sm mb-3" />
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-forest/10 rounded-sm" />
                <div className="h-5 w-20 bg-forest/10 rounded-sm" />
              </div>
            </div>
            <div className="border-[2.5px] border-forest/10 h-48" />
            <div className="border-[2.5px] border-forest/10 h-20" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-forest/10 rounded-sm" />
              <div className="h-3 w-5/6 bg-forest/10 rounded-sm" />
              <div className="h-3 w-4/6 bg-forest/10 rounded-sm" />
            </div>
            <div className="h-14 bg-forest/10" />
          </div>
        </div>
      </div>
    </main>
  );
}
