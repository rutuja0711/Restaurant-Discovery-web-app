export default function RestaurantCard({ restaurant }) {
  const primaryImage = restaurant.images?.[0]?.imageUrl;

  return (
    <div className="card">
      {primaryImage ? (
        <div className="card-image" style={{ backgroundImage: `url(${primaryImage})` }} />
      ) : (
        <div className="card-image-placeholder">No image</div>
      )}
      <h3>{restaurant.name}</h3>
      <p>{restaurant.cuisine} · {restaurant.location}</p>
      <p>★ {restaurant.rating} · {restaurant.priceRange}</p>
    </div>
  );
}
