'use client';
import { useEffect, useState } from 'react';
import { useAdminGuard } from '@/lib/useAdminGuard';
import Link from 'next/link';

export default function AdminDashboard() {
  const checked = useAdminGuard();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checked) return;
    fetch('/api/restaurants')
      .then((res) => res.json())
      .then(setRestaurants)
      .finally(() => setLoading(false));
  }, [checked]);

  async function handleDelete(id) {
    if (!confirm('Delete this restaurant?')) return;
    await fetch(`/api/restaurants/${id}`, { method: 'DELETE' });
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
  }

  if (!checked) return null;
  if (loading) return <p>Loading...</p>;

  return (
    <main>
      <h1>Manage Restaurants</h1>
      <Link href="/admin/restaurants/new">+ Add restaurant</Link>
      {restaurants.length === 0 && <p>No restaurants yet. Add your first one.</p>}
      <table>
        <thead>
          <tr><th>Name</th><th>Cuisine</th><th>Location</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {restaurants.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.cuisine}</td>
              <td>{r.location}</td>
              <td>
                <Link href={`/admin/restaurants/${r.id}/edit`}>Edit</Link>{' '}
                <button onClick={() => handleDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}