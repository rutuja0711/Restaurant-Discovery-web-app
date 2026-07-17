'use client';
import { useEffect, useState } from 'react';
import { useSuperadminGuard } from '@/lib/useSuperadminGuard';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function AdminDashboard() {
  const checked = useSuperadminGuard();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!checked) return;
    fetch('/api/restaurants').then((res) => res.json()).then(setRestaurants).finally(() => setLoading(false));
  }, [checked]);

  async function handleDelete(id) {
    if (!confirm('Delete this restaurant?')) return;
    await fetch(`/api/restaurants/${id}`, { method: 'DELETE' });
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
    setShowModal(true);
  }

  if (!checked) return null;
  if (loading) return <><Navbar /><p className="state-msg">Loading...</p></>;

  return (
    <>
      <Navbar />
      <main className="admin-page">
        <h1>Manage Restaurants</h1>
        <Link href="/admin/restaurants/new" className="action-btn primary">+ Add restaurant</Link>

        {restaurants.length === 0 && <p className="state-msg">No restaurants yet. Add your first one.</p>}

        {restaurants.length > 0 && (
          <table>
            <thead><tr><th>Name</th><th>Cuisine</th><th>Location</th><th>Actions</th></tr></thead>
            <tbody>
              {restaurants.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td><td>{r.cuisine}</td><td>{r.location}</td>
                  <td>
                    <Link href={`/admin/restaurants/${r.id}/edit`}>Edit</Link>{' '}
                    <button onClick={() => handleDelete(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <ConfirmationModal
          open={showModal}
          title="Restaurant deleted"
          message="The listing has been removed from the site."
          onClose={() => setShowModal(false)}
        />
      </main>
    </>
  );
}
