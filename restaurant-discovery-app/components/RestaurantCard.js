export default function RestaurantCard({ restaurant }) {
  const primaryImage = restaurant.images?.[0]?.imageUrl;
  const cuisines = restaurant.cuisine?.split(',').map((c) => c.trim()).join(' · ');

  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-card-md transition hover:-translate-y-1.5 hover:shadow-card-lg">
      <div
        className="relative flex h-[210px] flex-col justify-between bg-[#eceff3] bg-cover bg-center max-[480px]:h-[180px]"
        style={primaryImage ? { backgroundImage: `url(${primaryImage})` } : undefined}
      >
        {!primaryImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#eceff3] to-[#f7f8fa] text-[13px] text-text-muted">
            No image
          </div>
        )}

        <div className="relative z-[2] flex justify-between p-3">
          <span className="rounded-[20px] bg-white/92 px-2.5 py-1 text-xs font-bold text-forest shadow-card-sm">
            ★ {restaurant.rating}
          </span>
          {restaurant.distanceKm !== undefined && (
            <span className="rounded-[20px] bg-forest px-2.5 py-1 text-[11px] font-semibold text-white">
              {restaurant.distanceKm.toFixed(1)} km
            </span>
          )}
        </div>

        <div className="relative z-[2] bg-gradient-to-t from-black/78 via-black/5 to-transparent px-3.5 pt-4 pb-3.5">
          <h3 className="m-0 mb-1 font-serif text-[1.05rem] text-white">{restaurant.name}</h3>
          <p className="m-0 text-[12.5px] capitalize text-white/85">
            {cuisines} {restaurant.location ? `· ${restaurant.location}` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3.5 py-2.5 text-[12.5px] text-text-muted">
        <span>{restaurant.priceRange || '—'}</span>
        <span className="opacity-50">•</span>
        <span>{restaurant.openingHours ? 'Open now' : ''}</span>
      </div>
    </div>
  );
}
