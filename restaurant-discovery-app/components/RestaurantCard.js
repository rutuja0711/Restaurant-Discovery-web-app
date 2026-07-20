export default function RestaurantCard({ restaurant }) {
  const primaryImage = restaurant.images?.[0]?.imageUrl;
  const cuisines = restaurant.cuisine?.split(',').map((c) => c.trim()).join(' · ');

  return (
    <div className="card-v2">
      <div
        className="card-v2-image"
        style={primaryImage ? { backgroundImage: `url(${primaryImage})` } : undefined}
      >
        {!primaryImage && <div className="card-v2-noimage">No image</div>}

        <div className="card-v2-topRow">
          <span className="card-v2-rating">★ {restaurant.rating}</span>
          {restaurant.distanceKm !== undefined && (
            <span className="card-v2-distance">{restaurant.distanceKm.toFixed(1)} km</span>
          )}
        </div>

        <div className="card-v2-overlay">
          <h3>{restaurant.name}</h3>
          <p>{cuisines} {restaurant.location ? `· ${restaurant.location}` : ''}</p>
        </div>
      </div>

      <div className="card-v2-footer">
        <span>{restaurant.priceRange || '—'}</span>
        <span className="card-v2-dot">•</span>
        <span>{restaurant.openingHours ? 'Open now' : ''}</span>
      </div>
    </div>
  );
}
