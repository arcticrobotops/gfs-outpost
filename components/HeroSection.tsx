import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden border-b-[2.5px] border-forest">
      {/* Hero image */}
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh]">
        <Image
          src="https://images.unsplash.com/photo-1502680390548-bdbac40b3029?w=1920&q=80"
          alt="Oregon coast at dawn, waves breaking over misty shoreline"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/30 to-forest/10" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 sm:pb-14 md:pb-16 px-4 text-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 sm:w-12 bg-copper/80" />
            <p className="font-data text-xs tracking-[0.3em] text-copper uppercase">
              Station 45&deg;N &mdash; Neskowin, Oregon
            </p>
            <div className="h-px w-8 sm:w-12 bg-copper/80" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-linen tracking-wide leading-tight max-w-2xl">
            Coldwater Goods from the Edge
          </h2>
          <p className="mt-4 font-body text-sm sm:text-base text-linen/70 max-w-lg leading-relaxed">
            Surf essentials tested in the cold waters of the Pacific Northwest. Built for dawn patrols and ghost forest sessions.
          </p>
          <div className="mt-6">
            <a
              href="#inventory"
              className="inline-block font-data text-xs tracking-[0.25em] uppercase px-8 py-3 border-[2px] border-linen/40 text-linen hover:bg-linen/10 transition-colors duration-200"
            >
              Browse Inventory
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
