'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setRestaurant(data))
      .catch(() => setError('Restaurant not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.cuisine} · {restaurant.location}</p>
      <p>{restaurant.description}</p>
      <p><strong>Address:</strong> {restaurant.address}</p>
      <p><strong>Price range:</strong> {restaurant.priceRange}</p>
      <p><strong>Hours:</strong> {restaurant.openingHours}</p>
      <p><strong>Contact:</strong> {restaurant.contactNumber}</p>
      <p><strong>Rating:</strong> ★ {restaurant.rating}</p>
    </main>
  );
}