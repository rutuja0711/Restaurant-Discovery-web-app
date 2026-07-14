export default function RestaurantCard({ restaurant }) {
    return (
      <div className="card">
        <div className="card-image-placeholder">No image</div>
        <h3>{restaurant.name}</h3>
        <p>{restaurant.cuisine} · {restaurant.location}</p>
        <p>★ {restaurant.rating} · {restaurant.priceRange}</p>
      </div>
    );
  }