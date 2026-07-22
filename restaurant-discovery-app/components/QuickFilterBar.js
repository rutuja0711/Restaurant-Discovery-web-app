'use client';

const PILLS = [
  'Instant reservation',
  
  'Smart Voucher restaurants',
  'All day dining',
  'Bottomless brunch',
  'Breakfast',
  'Brunch',
  'Byob',
  'Dinner',
  'Late night dining',
];

export default function QuickFilterBar({ selected, onToggle }) {
  return (
    <div className="scrollbar-hide mb-6 flex gap-3 overflow-x-auto pb-1">
      {PILLS.map((pill) => {
        const active = selected.includes(pill);
        return (
          <button
            key={pill}
            type="button"
            onClick={() => onToggle(pill)}
            className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium ${
              active
                ? 'border-forest bg-forest text-white'
                : 'border-black/12 bg-white text-black hover:bg-black/5'
            }`}
          >
            {pill}
          </button>
        );
      })}
    </div>
  );
}