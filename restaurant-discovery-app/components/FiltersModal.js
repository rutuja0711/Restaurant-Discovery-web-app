'use client';
import { useMemo, useState } from 'react';

const TABS = ['Sort by', 'Cuisines', 'Rating', 'Cost for two', 'More filters'];

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating_desc', label: 'Rating: High to Low' },
  { value: 'cost_asc', label: 'Cost: Low to High' },
  { value: 'cost_desc', label: 'Cost: High to Low' },
  { value: 'distance', label: 'Distance' },
];

const RATING_STEPS = [0, 3.5, 4.0, 4.5, 5.0];

const AMENITIES = [
  'Credit card',
  'Serves Alcohol',
  'Open Now',
  'Wifi',
  'Outdoor seating',
  'Cafés',
  'Hygiene Rated',
];

// A representative world-cuisine list for search/multi-select
const CUISINE_LIST = [
  'Abruzzese', 'Aceh', 'Aegean', 'Afghan', 'Afghani', 'African', 'Agritourism',
  'Alcoholic Beverages', 'Alentejana', 'Algerian', 'Altoatesine', 'Amazonian',
  'American', 'Amish', 'Andhra', 'Arab', 'Argentinian', 'Asian', 'Assamese',
  'Australian', 'Austrian', 'Awadhi', 'Bakery', 'Balti', 'Bangladeshi',
  'Barbecue', 'Bavarian', 'Belgian', 'Bengali', 'Bihari', 'Brazilian',
  'British', 'Burmese', 'Cajun', 'Cantonese', 'Caribbean', 'Chettinad',
  'Chinese', 'Coastal', 'Continental', 'Contemporary', 'Cuban', 'Desserts',
  'Ethiopian', 'European', 'Fast Food', 'Filipino', 'French', 'Fusion',
  'German', 'Goan', 'Greek', 'Gujarati', 'Hyderabadi', 'Indonesian',
  'Iranian', 'Italian', 'Japanese', 'Jewish', 'Kashmiri', 'Kerala', 'Konkan',
  'Korean', 'Lebanese', 'Malaysian', 'Maharashtrian', 'Mediterranean',
  'Mexican', 'Middle Eastern', 'Modern Indian', 'Mughlai', 'Nepalese',
  'North Indian', 'North Eastern', 'Oriya', 'Pan-Asian', 'Parsi', 'Persian',
  'Peruvian', 'Pizza', 'Portuguese', 'Punjabi', 'Rajasthani', 'Seafood',
  'Sindhi', 'South Indian', 'Spanish', 'Sri Lankan', 'Street Food', 'Sushi',
  'Tex-Mex', 'Thai', 'Tibetan', 'Turkish', 'Vegan', 'Vietnamese',
];

const inputBaseClass =
  'rounded-[10px] border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest';

export default function FiltersModal({ initialFilters, onApply, onClose }) {
  const [activeTab, setActiveTab] = useState('Sort by');
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy || 'popularity');
  const [selectedCuisines, setSelectedCuisines] = useState(
    initialFilters?.cuisines || []
  );
  const [cuisineSearch, setCuisineSearch] = useState('');
  const [minRating, setMinRating] = useState(initialFilters?.minRating || 0);
  const [costRange, setCostRange] = useState(
    initialFilters?.costRange || [0, 5000]
  );
  const [amenities, setAmenities] = useState(initialFilters?.amenities || []);
  const [amenitySearch, setAmenitySearch] = useState('');

  const filteredCuisines = useMemo(() => {
    const q = cuisineSearch.trim().toLowerCase();
    if (!q) return CUISINE_LIST;
    return CUISINE_LIST.filter((c) => c.toLowerCase().includes(q));
  }, [cuisineSearch]);

  const filteredAmenities = useMemo(() => {
    const q = amenitySearch.trim().toLowerCase();
    if (!q) return AMENITIES;
    return AMENITIES.filter((a) => a.toLowerCase().includes(q));
  }, [amenitySearch]);

  function toggleCuisine(c) {
    setSelectedCuisines((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function toggleAmenity(a) {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  function handleClearAll() {
    setSortBy('popularity');
    setSelectedCuisines([]);
    setCuisineSearch('');
    setMinRating(0);
    setCostRange([0, 5000]);
    setAmenities([]);
    setAmenitySearch('');
  }

  function handleApply() {
    onApply({
      sortBy,
      cuisines: selectedCuisines,
      minRating,
      costRange,
      amenities,
    });
    onClose();
  }

  const sidebarSubtext = {
    'Sort by': SORT_OPTIONS.find((o) => o.value === sortBy)?.label,
    Cuisines:
      selectedCuisines.length > 0 ? `${selectedCuisines.length} selected` : null,
    Rating: minRating > 0 ? `${minRating.toFixed(1)}+` : null,
    'Cost for two':
      costRange[0] > 0 || costRange[1] < 5000
        ? `₹${costRange[0]} - ${costRange[1] >= 5000 ? 'Any' : costRange[1]}`
        : null,
    'More filters': amenities.length > 0 ? `${amenities.length} selected` : null,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[900px] flex-col overflow-hidden rounded-[16px] bg-white shadow-card-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/8 px-7 py-5">
          <h2 className="m-0 text-2xl font-semibold">Filters</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer border-none bg-transparent p-1 text-2xl leading-none text-black/70 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-[220px] shrink-0 overflow-y-auto border-r border-black/8 bg-[#fafafa] max-[600px]:w-[140px]">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`block w-full cursor-pointer border-l-[3px] bg-transparent px-5 py-4 text-left text-[15px] font-medium ${
                  activeTab === tab
                    ? 'border-danger bg-white text-black'
                    : 'border-transparent text-text-muted hover:bg-black/5'
                }`}
              >
                {tab}
                {sidebarSubtext[tab] && (
                  <span className="mt-0.5 block text-[12.5px] font-normal text-danger">
                    {sidebarSubtext[tab]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-7">
            {activeTab === 'Sort by' && (
              <div className="flex flex-col gap-5">
                {SORT_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-3 text-[15px]"
                  >
                    <input
                      type="radio"
                      name="sortBy"
                      checked={sortBy === opt.value}
                      onChange={() => setSortBy(opt.value)}
                      className="h-[18px] w-[18px] accent-danger"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            )}

            {activeTab === 'Cuisines' && (
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    placeholder="Search here"
                    value={cuisineSearch}
                    onChange={(e) => setCuisineSearch(e.target.value)}
                    className={`${inputBaseClass} w-full`}
                  />
                </div>
                <div className="grid max-h-[360px] grid-cols-2 gap-x-4 gap-y-4 overflow-y-auto pr-2 max-[600px]:grid-cols-1">
                  {filteredCuisines.map((c) => (
                    <label
                      key={c}
                      className="flex cursor-pointer items-center gap-2.5 text-[14.5px]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCuisines.includes(c)}
                        onChange={() => toggleCuisine(c)}
                        className="h-[18px] w-[18px] accent-danger"
                      />
                      {c}
                    </label>
                  ))}
                  {filteredCuisines.length === 0 && (
                    <p className="col-span-2 text-sm text-text-muted">
                      No cuisines match your search.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Rating' && (
              <div>
                <p className="m-0 text-sm text-text-muted">Rating</p>
                <p className="m-0 mb-8 text-lg font-semibold">
                  {minRating > 0 ? minRating.toFixed(1) : 'Any'}
                </p>
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-black/80" />
                  {RATING_STEPS.map((step) => (
                    <button
                      key={step}
                      onClick={() => setMinRating(step)}
                      className="relative z-[1] flex flex-col items-center gap-2"
                    >
                      <span
                        className={`rounded-full border-2 border-black bg-black transition-all ${
                          minRating === step ? 'h-5 w-5' : 'h-3.5 w-3.5'
                        }`}
                      />
                      <span className="text-[13px] text-text-muted">
                        {step === 0 ? 'Any' : step.toFixed(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Cost for two' && (
              <div>
                <p className="m-0 text-sm text-text-muted">Cost for two</p>
                <p className="m-0 mb-10 text-lg font-semibold">
                  ₹{costRange[0]} - {costRange[1] >= 5000 ? 'Any' : `₹${costRange[1]}`}
                </p>
                <div className="relative mt-6 h-[2px] bg-black/15">
                  <div
                    className="absolute h-[2px] bg-danger"
                    style={{
                      left: `${(costRange[0] / 5000) * 100}%`,
                      right: `${100 - (costRange[1] / 5000) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={100}
                    value={costRange[0]}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), costRange[1] - 100);
                      setCostRange([val, costRange[1]]);
                    }}
                    className="range-thumb-only pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
                  />
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={100}
                    value={costRange[1]}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), costRange[0] + 100);
                      setCostRange([costRange[0], val]);
                    }}
                    className="range-thumb-only pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
                  />
                </div>
                <style jsx>{`
                  .range-thumb-only::-webkit-slider-thumb {
                    pointer-events: auto;
                    appearance: none;
                    height: 18px;
                    width: 18px;
                    border-radius: 9999px;
                    background: #e0576a;
                    cursor: pointer;
                  }
                  .range-thumb-only::-moz-range-thumb {
                    pointer-events: auto;
                    height: 18px;
                    width: 18px;
                    border-radius: 9999px;
                    background: #e0576a;
                    border: none;
                    cursor: pointer;
                  }
                `}</style>
              </div>
            )}

            {activeTab === 'More filters' && (
              <div className="flex flex-col gap-4">
                <input
                  placeholder="Search here"
                  value={amenitySearch}
                  onChange={(e) => setAmenitySearch(e.target.value)}
                  className={`${inputBaseClass} w-full`}
                />
                <div className="flex flex-col gap-4">
                  {filteredAmenities.map((a) => (
                    <label
                      key={a}
                      className="flex cursor-pointer items-center gap-2.5 text-[15px]"
                    >
                      <input
                        type="checkbox"
                        checked={amenities.includes(a)}
                        onChange={() => toggleAmenity(a)}
                        className="h-[18px] w-[18px] accent-danger"
                      />
                      {a}
                    </label>
                  ))}
                  {filteredAmenities.length === 0 && (
                    <p className="text-sm text-text-muted">No filters match your search.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-black/8 px-7 py-4">
          <button
            onClick={handleClearAll}
            className="cursor-pointer rounded-[10px] border-none bg-black/5 px-6 py-3 text-sm font-medium text-forest-dark hover:bg-black/10"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="cursor-pointer rounded-[10px] border-none bg-danger px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}