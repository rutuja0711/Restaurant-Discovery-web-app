'use client';
import { useEffect, useRef, useState } from 'react';

const cuisines = [
  { name: 'North Indian', emoji: '🍛' },
  { name: 'Italian', emoji: '🍝' },
  { name: 'Chinese', emoji: '🥢' },
  { name: 'South Indian', emoji: '🥥' },
  { name: 'American', emoji: '🍔' },
  { name: 'Maharashtrian', emoji: '🍲' },
  { name: 'Punjabi', emoji: '🧈' },
  
]


export default function CuisineExplore({ onSelect }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateArrowVisibility() {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);
  }

  useEffect(() => {
    updateArrowVisibility();

    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateArrowVisibility);
    window.addEventListener('resize', updateArrowVisibility);

    return () => {
      el.removeEventListener('scroll', updateArrowVisibility);
      window.removeEventListener('resize', updateArrowVisibility);
    };
  }, []);

  function scroll(direction) {
    if (!scrollRef.current) return;
    const amount = 260;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }

  return (
    <section id="explore" className="relative py-10">
      <h2 className="mb-6 text-center font-serif text-2xl text-forest">Eat what makes you happy</h2>

      <div className="relative mx-auto max-w-6xl px-2">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 z-10 flex -translate-y-1/2 -translate-x-3 h-9 w-9 items-center justify-center rounded-full bg-white text-forest-dark shadow-md max-[480px]:h-7 max-[480px]:w-7 max-[480px]:text-sm"
          >
            ‹
          </button>
        )}

        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-8 overflow-x-auto scroll-smooth px-2 py-2 max-[480px]:gap-4"
        >
          {cuisines.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => onSelect(c.name)}
              className="flex shrink-0 basis-[30vw] flex-col items-center gap-2 focus:outline-none sm:basis-auto"
            >
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl shadow-md transition-transform hover:scale-105 max-[480px]:h-16 max-[480px]:w-16 max-[480px]:text-2xl">
                {c.emoji}
              </span>
              <span className="text-sm font-medium text-forest-dark max-[480px]:text-xs">
                {c.name}
              </span>
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 z-10 flex -translate-y-1/2 translate-x-3 h-9 w-9 items-center justify-center rounded-full bg-white text-forest-dark shadow-md max-[480px]:h-7 max-[480px]:w-7 max-[480px]:text-sm"
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
}