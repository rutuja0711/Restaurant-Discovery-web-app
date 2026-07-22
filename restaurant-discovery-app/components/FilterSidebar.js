'use client';
import { useMemo, useState } from 'react';
import Accordion from './Accordion';

const CUISINE_LIST = [
  'North Indian', 'South Indian', 'Italian', 'Chinese', 'American',
  'Maharashtrian', 'Punjabi', 'Gujarati', 'Mexican', 'Thai', 'Japanese',
  'Continental', 'Mediterranean', 'Lebanese', 'French', 'Korean',
  'Vietnamese', 'Spanish', 'Sushi', 'Seafood', 'Street Food', 'Bakery',
  'Desserts', 'Fast Food', 'Barbecue',
];

const BOOKING_OPTIONS = [
  'Instant reservation',
  
  
];

const RESTAURANT_TYPES = ['Fine Dining', 'Casual Dining', 'Cafe', 'Rooftop', 'Bar & Lounge'];
const FOOD_OCCASIONS = ['Date Night', 'Family Friendly', 'Business Lunch', 'Group Dining'];
const AMBIENCE_OPTIONS = ['Romantic', 'Lively', 'Quiet', 'Outdoor Seating', 'Live Music'];

const RATING_STEPS = [0, 3.5, 4.0, 4.5, 5.0];

export default function FilterSidebar({ filters, onChange, mapLocation }) {
  const [cuisineSearch, setCuisineSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredCuisines = useMemo(() => {
    const q = cuisineSearch.trim().toLowerCase();
    if (!q) return CUISINE_LIST;
    return CUISINE_LIST.filter((c) => c.toLowerCase().includes(q));
  }, [cuisineSearch]);

  function toggleInArray(field, value) {
    const current = filters[field] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [field]: next });
  }

  const mapQuery = encodeURIComponent(mapLocation || 'Nashik, Maharashtra');
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  return (
    <aside className="w-full max-w-[320px] shrink-0 max-[900px]:max-w-none">
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="mb-4 hidden w-full cursor-pointer items-center justify-between rounded-[10px] border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-forest-dark shadow-card-sm max-[900px]:flex"
        aria-expanded={mobileOpen}
      >
        Filters
        <span className={`text-xs transition-transform ${mobileOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      <div className={`${mobileOpen ? '' : 'max-[900px]:hidden'}`}>
        <div className="mb-4 overflow-hidden rounded-[14px] shadow-card-sm">
          <iframe
            title="area-map"
            src={mapSrc}
            className="h-[220px] w-full border-0"
            loading="lazy"
          />
        </div>

        <Accordion title="Distance" defaultOpen>
          <input
            type="range"
            min={1}
            max={25}
            step={1}
            value={filters.radiusKm}
            onChange={(e) => onChange({ ...filters, radiusKm: Number(e.target.value) })}
            className="w-full accent-forest"
          />
          <p className="mt-1 text-[13px] text-text-muted">{filters.radiusKm} miles</p>
        </Accordion>

        <Accordion title="Booking options" defaultOpen>
          <div className="flex flex-col gap-3">
            {BOOKING_OPTIONS.map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                <input
                  type="checkbox"
                  checked={(filters.amenities || []).includes(opt)}
                  onChange={() => toggleInArray('amenities', opt)}
                  className="h-[16px] w-[16px] accent-forest"
                />
                {opt}
              </label>
            ))}
          </div>
        </Accordion>

        <Accordion title="Cuisine">
          <input
            placeholder="Search cuisines..."
            value={cuisineSearch}
            onChange={(e) => setCuisineSearch(e.target.value)}
            className="mb-3 w-full rounded-[8px] border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          />
          <div className="flex max-h-[220px] flex-col gap-3 overflow-y-auto pr-1">
            {filteredCuisines.map((c) => (
              <label key={c} className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                <input
                  type="checkbox"
                  checked={(filters.cuisines || []).includes(c)}
                  onChange={() => toggleInArray('cuisines', c)}
                  className="h-[16px] w-[16px] accent-forest"
                />
                {c}
              </label>
            ))}
          </div>
        </Accordion>

       

        <Accordion title="Rating">
          <div className="relative flex items-center justify-between py-2">
            <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-black/15" />
            {RATING_STEPS.map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => onChange({ ...filters, minRating: step })}
                className="relative z-[1] flex flex-col items-center gap-1.5"
              >
                <span
                  className={`rounded-full border-2 border-forest bg-forest transition-all ${
                    filters.minRating === step ? 'h-4 w-4' : 'h-2.5 w-2.5'
                  }`}
                />
                <span className="text-[11px] text-text-muted">
                  {step === 0 ? 'Any' : step.toFixed(1)}
                </span>
              </button>
            ))}
          </div>
        </Accordion>

        <Accordion title="Price">
          <p className="mb-3 text-[13px] text-text-muted">
            ₹{filters.costRange[0]} - {filters.costRange[1] >= 5000 ? 'Any' : `₹${filters.costRange[1]}`}
          </p>
          <div className="relative h-[2px] bg-black/15">
            <div
              className="absolute h-[2px] bg-forest"
              style={{
                left: `${(filters.costRange[0] / 5000) * 100}%`,
                right: `${100 - (filters.costRange[1] / 5000) * 100}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={5000}
              step={100}
              value={filters.costRange[0]}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), filters.costRange[1] - 100);
                onChange({ ...filters, costRange: [val, filters.costRange[1]] });
              }}
              className="range-thumb-only pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
            />
            <input
              type="range"
              min={0}
              max={5000}
              step={100}
              value={filters.costRange[1]}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), filters.costRange[0] + 100);
                onChange({ ...filters, costRange: [filters.costRange[0], val] });
              }}
              className="range-thumb-only pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
            />
          </div>
          <style jsx>{`
            .range-thumb-only::-webkit-slider-thumb {
              pointer-events: auto;
              appearance: none;
              height: 16px;
              width: 16px;
              border-radius: 9999px;
              background: #e0576a;
              cursor: pointer;
            }
            .range-thumb-only::-moz-range-thumb {
              pointer-events: auto;
              height: 16px;
              width: 16px;
              border-radius: 9999px;
              background: #e0576a;
              border: none;
              cursor: pointer;
            }
          `}</style>
        </Accordion>

        <Accordion title="Restaurant type">
          <div className="flex flex-col gap-3">
            {RESTAURANT_TYPES.map((t) => (
              <label key={t} className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                <input
                  type="checkbox"
                  checked={(filters.restaurantTypes || []).includes(t)}
                  onChange={() => toggleInArray('restaurantTypes', t)}
                  className="h-[16px] w-[16px] accent-forest"
                />
                {t}
              </label>
            ))}
          </div>
        </Accordion>

        <Accordion title="Food Occasions">
          <div className="flex flex-col gap-3">
            {FOOD_OCCASIONS.map((o) => (
              <label key={o} className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                <input
                  type="checkbox"
                  checked={(filters.occasions || []).includes(o)}
                  onChange={() => toggleInArray('occasions', o)}
                  className="h-[16px] w-[16px] accent-forest"
                />
                {o}
              </label>
            ))}
          </div>
        </Accordion>

        <Accordion title="Ambience">
          <div className="flex flex-col gap-3">
            {AMBIENCE_OPTIONS.map((a) => (
              <label key={a} className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                <input
                  type="checkbox"
                  checked={(filters.ambience || []).includes(a)}
                  onChange={() => toggleInArray('ambience', a)}
                  className="h-[16px] w-[16px] accent-forest"
                />
                {a}
              </label>
            ))}
          </div>
        </Accordion>
      </div>
    </aside>
  );
}