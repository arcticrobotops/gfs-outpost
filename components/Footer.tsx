export default function Footer() {
  return (
    <footer className="bg-forest text-linen border-t-[3px] border-copper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="flex flex-col items-center text-center">
          {/* Decorative frame around station ID block */}
          <div className="border border-copper/25 px-10 py-8 sm:px-16 sm:py-10">
            {/* Station ID header */}
            <p className="font-data text-[11px] tracking-[0.25em] text-copper uppercase mb-6">
              Station ID
            </p>

            {/* Brand name */}
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-wide text-linen mb-4">
              GHOST FOREST SURF CLUB
            </h2>

            {/* Copper divider */}
            <div className="w-24 h-[2px] bg-copper mx-auto mb-4" />

            {/* Station data */}
            <div className="space-y-1.5">
              <p className="font-data text-[11px] tracking-[0.15em] text-linen/70 uppercase">
                Est. 2024 / 45.10&deg;N, 123.98&deg;W
              </p>
              <p className="font-data text-[11px] tracking-[0.15em] text-linen/70 uppercase">
                Neskowin, Oregon
              </p>
            </div>
          </div>

          {/* Bottom links */}
          <div className="mt-10 pt-6 border-t border-linen/10 w-full max-w-md">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {['Shop', 'About', 'Contact', 'Returns'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="font-data text-[11px] tracking-[0.15em] text-linen/50 uppercase hover:text-copper transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <p className="mt-6 font-data text-[11px] tracking-[0.1em] text-linen/30 uppercase">
            &copy; 2024 Ghost Forest Surf Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
