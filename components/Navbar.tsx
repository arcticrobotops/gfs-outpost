'use client';

import { useState } from 'react';
import { ShopifyCollection } from '@/types/shopify';

interface NavbarProps {
  collections: ShopifyCollection[];
  activeCollection: string;
  onCollectionChange: (handle: string) => void;
}

export default function Navbar({
  collections,
  activeCollection,
  onCollectionChange,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top stripe */}
      <div className="bg-forest">
        <div className="mx-auto max-w-7xl px-4">
          <p className="py-1.5 text-center font-data text-[13px] tracking-[0.1em] sm:tracking-[0.2em] text-copper uppercase">
            Est. 2024 &mdash; Neskowin, OR
          </p>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-linen border-b-2 border-forest">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-4">
            {/* Menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 font-data text-xs tracking-[0.15em] text-forest uppercase hover:text-copper transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                width="18"
                height="12"
                viewBox="0 0 18 12"
                fill="none"
                className="text-current"
              >
                <path
                  d={menuOpen ? "M1 1L9 9L17 1" : "M0 1h18M0 6h18M0 11h18"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="hidden sm:inline">Menu</span>
            </button>

            {/* Brand */}
            <h1 className="font-display text-xl sm:text-2xl md:text-[26px] font-semibold tracking-wide text-forest text-center">
              GHOST FOREST SURF CLUB
            </h1>

            {/* Bag button */}
            <button
              className="flex items-center gap-1.5 font-data text-xs tracking-[0.15em] text-forest uppercase hover:text-copper transition-colors"
              aria-label="Shopping bag"
            >
              <span className="hidden sm:inline">Bag</span>
              <svg
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                className="text-current"
              >
                <path
                  d="M1 5h16v13a1 1 0 01-1 1H2a1 1 0 01-1-1V5zM5 5V4a4 4 0 118 0v1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category filter bar */}
      <div className="bg-linen border-b-2 border-forest/20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            <span className="shrink-0 font-data text-xs tracking-[0.1em] sm:tracking-[0.2em] text-sage uppercase mr-1 hidden sm:inline">
              Filter:
            </span>
            <FilterPill
              label="All"
              active={activeCollection === 'all'}
              onClick={() => onCollectionChange('all')}
            />
            {collections.map((col) => (
              <FilterPill
                key={col.handle}
                label={col.title}
                active={activeCollection === col.handle}
                onClick={() => onCollectionChange(col.handle)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="bg-forest border-b-2 border-copper md:hidden">
          <nav className="mx-auto max-w-7xl px-6 py-6">
            <ul className="space-y-4">
              {['Shop All', 'About', 'Field Reports', 'Contact'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="block font-data text-sm tracking-[0.15em] text-linen uppercase hover:text-copper transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-1.5 min-h-[44px] inline-flex items-center font-data text-xs tracking-[0.12em] uppercase transition-colors snap-start
        ${
          active
            ? 'bg-forest text-linen'
            : 'bg-transparent text-forest border border-forest/30 hover:border-forest hover:bg-forest/5'
        }`}
    >
      {label}
    </button>
  );
}
