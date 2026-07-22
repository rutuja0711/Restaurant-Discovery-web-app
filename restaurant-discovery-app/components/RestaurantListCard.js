'use client';
import { useState } from 'react';

export default function RestaurantListCard({ restaurant }) {
  const [favorited, setFavorited] = useState(false);
  const primaryImage = restaurant.images?.[0]?.imageUrl;
  const cuisines = restaurant.cuisine
    ?.split(',')
    .map((c) => c.trim())
    .filter(Boolean);

  const tags = [
    restaurant.priceRange,
    ...(cuisines || []),
  ].filter(Boolean);

  return (
    <div className="flex gap-5 overflow-hidden rounded-[14px] bg-white p-4 shadow-card-sm max-[700px]:flex-col">
      <div
        className="relative h-[220px] w-[42%] min-w-[130px] shrink-0 rounded-[10px] bg-cover bg-center max-[700px]:h-[200px] max-[700px]:w-full"
        style={primaryImage ? { backgroundImage: `url(${primaryImage})` } : undefined}
      >
        {!primaryImage && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[10px] bg-[#eceff3] text-[13px] text-text-muted">
            No image
          </div>
        )}

        {restaurant.rewardPoints && (
          <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-[6px] bg-black/75 px-2.5 py-1 text-[11px] font-bold text-white">
            ★ {restaurant.rewardPoints} POINTS
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setFavorited((v) => !v);
          }}
          aria-label="Save restaurant"
          className={`absolute right-2.5 top-2.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none shadow-card-sm ${
            favorited ? 'bg-forest text-white' : 'bg-white/90 text-black/60'
          }`}
        >
          ♥
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <h3 className="m-0 truncate font-serif text-xl text-forest-dark">{restaurant.name}</h3>
        <p className="m-0 text-[13px] text-text-muted">
          {restaurant.location}{restaurant.address ? `, ${restaurant.address}` : ''}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {restaurant.awardTier && (
              <span className="rounded-full border border-black/10 px-3 py-1 text-[12px] font-medium">
                {restaurant.awardTier}
              </span>
            )}
            {tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-full border border-black/10 px-3 py-1 text-[12px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {restaurant.description && (
          <p className="m-0 line-clamp-2 text-[13.5px] leading-relaxed text-text-muted">
            {restaurant.editorialLabel && (
              <strong className="mr-1 text-black">{restaurant.editorialLabel}</strong>
            )}
            {restaurant.description}
          </p>
        )}

        <a
          href={`/restaurants/${restaurant.id}#booking`}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 inline-block w-fit cursor-pointer rounded-[10px] border-none bg-forest px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-white shadow-card-sm hover:opacity-90"
        >
          Book a Table
        </a>
      </div>
    </div>
  );
}