'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-linen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h2 className="font-display text-2xl mb-4 text-forest">
          Something went wrong
        </h2>
        <p className="font-body text-sm text-slate mb-8">
          We hit a snag loading the page. This usually resolves on retry.
        </p>
        <button
          onClick={() => reset()}
          className="font-body text-xs uppercase tracking-widest px-6 py-3 border border-forest/30 hover:bg-forest hover:text-linen transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
