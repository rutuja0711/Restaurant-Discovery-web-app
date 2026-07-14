'use client';
import { useEffect, useState } from 'react';
import RestaurantCard from '@/components/RestaurantCard';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/restaurants')
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch(() => setError('Failed to load restaurants'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading restaurants...</p>;
  if (error) return <p>{error}</p>;
  if (restaurants.length === 0) return <p>No restaurants found.</p>;

  return (
    <main>
      <h1>Restaurant Discovery</h1>
      <div className="grid">
        {restaurants.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </main>
  );
}