// export default function RestaurantCard({ restaurant }) {
//   const primaryImage = restaurant.images?.[0]?.imageUrl;
//   const cuisines = restaurant.cuisine?.split(',').map((c) => c.trim()).join(' · ');

//   return (
//     <div className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-card-md transition hover:-translate-y-1.5 hover:shadow-card-lg">
//       <div
//         className="relative flex h-[210px] flex-col justify-between bg-[#eceff3] bg-cover bg-center max-[480px]:h-[180px]"
//         style={primaryImage ? { backgroundImage: `url(${primaryImage})` } : undefined}
//       >
//         {!primaryImage && (
//           <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#eceff3] to-[#f7f8fa] text-[13px] text-text-muted">
//             No image
//           </div>
//         )}

//         <div className="relative z-[2] flex justify-between p-3">
//           <span className="rounded-[20px] bg-white/92 px-2.5 py-1 text-xs font-bold text-forest shadow-card-sm">
//             ★ {restaurant.rating}
//           </span>
//           {restaurant.distanceKm !== undefined && (
//             <span className="rounded-[20px] bg-forest px-2.5 py-1 text-[11px] font-semibold text-white">
//               {restaurant.distanceKm.toFixed(1)} km
//             </span>
//           )}
//         </div>

//         <div className="relative z-[2] bg-gradient-to-t from-black/78 via-black/5 to-transparent px-3.5 pt-4 pb-3.5">
//           <h3 className="m-0 mb-1 font-serif text-[1.05rem] text-white">{restaurant.name}</h3>
//           <p className="m-0 text-[12.5px] capitalize text-white/85">
//             {cuisines} {restaurant.location ? `· ${restaurant.location}` : ''}
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center gap-2 px-3.5 py-2.5 text-[12.5px] text-text-muted">
//         <span>{restaurant.priceRange || '—'}</span>
//         <span className="opacity-50">•</span>
//         <span>{restaurant.openingHours ? 'Open now' : ''}</span>
//       </div>
//     </div>
//   );
// }
export default function RestaurantCard({ restaurant }) {
  const primaryImage = restaurant.images?.[0]?.imageUrl;
  const cuisines = restaurant.cuisine
    ?.split(',')
    .map((c) => c.trim())
    .join(', ');

  return (
    <div className="flex flex-col overflow-hidden rounded-[16px] bg-white shadow-card-md transition hover:-translate-y-1 hover:shadow-card-lg">
      <div
        className="relative h-[180px] bg-[#eceff3] bg-cover bg-center"
        style={primaryImage ? { backgroundImage: `url(${primaryImage})` } : undefined}
      >
        {!primaryImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#eceff3] to-[#f7f8fa] text-[13px] text-text-muted">
            No image
          </div>
        )}

        {restaurant.promoted && (
          <span className="absolute left-0 top-0 rounded-br-[10px] bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white">
            Promoted
          </span>
        )}

        <span
          className={`absolute right-2.5 top-2.5 flex items-center gap-0.5 rounded-[6px] px-2 py-1 text-[12px] font-bold text-white shadow-card-sm ${
            restaurant.isNew ? 'bg-blue-600' : 'bg-success'
          }`}
        >
          {restaurant.isNew ? 'New ★' : `${restaurant.rating} ★`}
        </span>

        {restaurant.discountLabel && (
          <span className="absolute bottom-0 left-0 flex items-center gap-1 bg-gradient-to-r from-forest to-forest-dark px-3 py-1.5 text-[12px] font-semibold text-white">
            <span aria-hidden>%</span> {restaurant.discountLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5 px-3.5 py-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="m-0 truncate text-[15px] font-semibold text-forest-dark">
            {restaurant.name}
          </h3>
          {!restaurant.isNew && (
            <span className="flex shrink-0 items-center gap-0.5 rounded-[6px] bg-success px-1.5 py-0.5 text-[11px] font-bold text-white">
              {restaurant.rating} ★
            </span>
          )}
        </div>

        <p className="m-0 truncate text-[12.5px] text-text-muted">{cuisines}</p>

        <div className="mt-0.5 flex items-center justify-between text-[12.5px] text-text-muted">
          <span>{restaurant.priceRange ? `${restaurant.priceRange} for two` : '—'}</span>
          {restaurant.distanceKm !== undefined && (
            <span>{restaurant.distanceKm.toFixed(1)} km</span>
          )}
        </div>

        <p className="m-0 truncate text-[12.5px] text-text-muted">{restaurant.location}</p>

        {restaurant.openingStatus && (
          <p className="m-0 text-[12.5px] font-medium text-orange-600">
            {restaurant.openingStatus}
          </p>
        )}
      </div>
    </div>
  );
}