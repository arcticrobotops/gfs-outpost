'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuOpen ? menuRef.current.scrollHeight : 0);
    }
  }, [menuOpen]);

  // Issue #8: Focus trap — focus first item on open, return focus on close
  useEffect(() => {
    if (menuOpen) {
      // Focus the first focusable element in the menu
      const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
        'button, a, [tabindex]:not([tabindex="-1"])'
      );
      // Slight delay to allow the menu to expand
      requestAnimationFrame(() => {
        firstFocusable?.focus();
      });
    }
  }, [menuOpen]);

  // Issue #8: Escape key closes menu and returns focus to toggle
  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    },
    [menuOpen],
  );

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

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
            {/* Menu button — mobile only */}
            <button
              ref={toggleRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center gap-1.5 font-data text-[13px] tracking-[0.15em] text-forest uppercase hover:text-copper transition-colors min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
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
            <span className="font-display text-xl sm:text-2xl md:text-[26px] font-semibold tracking-wide text-forest text-center">
              GHOST FOREST SURF CLUB
            </span>

            {/* Issue #16: Bag button — aria-disabled with tooltip */}
            <button
              className="flex items-center gap-1.5 font-data text-[13px] tracking-[0.15em] text-forest uppercase hover:text-copper transition-colors min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2"
              aria-label="Shopping bag"
              aria-disabled="true"
              title="Coming soon"
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
      <nav aria-label="Product filters" className="bg-linen border-b-2 border-forest/20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide snap-x snap-proximity">
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
      </nav>

      {/* Mobile menu with CSS transition */}
      {/* Issue #8: aria-hidden when closed, keydown for Escape */}
      <div
        ref={menuRef}
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out md:hidden"
        style={{
          maxHeight: menuHeight,
          opacity: menuOpen ? 1 : 0,
        }}
        aria-hidden={!menuOpen}
        onKeyDown={handleMenuKeyDown}
      >
        <div className="bg-forest border-b-2 border-copper">
          <nav aria-label="Mobile menu" className="mx-auto max-w-7xl px-6 py-6">
            <ul className="space-y-4">
              <li>
                <button
                  className="block font-data text-sm tracking-[0.15em] text-linen uppercase hover:text-copper transition-colors"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => {
                    onCollectionChange('all');
                    closeMenu();
                  }}
                >
                  Shop All
                </button>
              </li>
              {['About', 'Field Reports', 'Contact'].map((item) => (
                <li key={item}>
                  <span
                    aria-disabled="true"
                    className="block font-data text-sm tracking-[0.15em] text-linen/50 uppercase cursor-default"
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
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
      aria-pressed={active}
      className={`shrink-0 rounded-full px-4 py-1.5 min-h-[44px] inline-flex items-center font-data text-[13px] tracking-[0.12em] uppercase transition-colors snap-start focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2
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
