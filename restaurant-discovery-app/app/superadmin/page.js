'use client';
import { useEffect, useState } from 'react';
import { useSuperadminGuard } from '@/lib/useSuperadminGuard';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ConfirmationModal from '@/components/ConfirmationModal';

const actionBtnClass = 'inline-block cursor-pointer rounded-[10px] border-none bg-forest px-[18px] py-2.5 text-[13px] font-medium text-white shadow-card-sm no-underline';
const tableClass = 'mt-5 w-full border-separate border-spacing-0 overflow-hidden rounded-2xl bg-white shadow-card-md';
const thClass = 'bg-forest px-4 py-4 text-left text-sm font-semibold text-white';
const tdClass = 'border-b border-black/4 px-4 py-4 text-left text-sm';

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
  if (loading) return <><Navbar /><p className="px-6 py-[60px] text-center text-[15px] text-text-muted">Loading...</p></>;

  return (
    <>
      <Navbar />
      <main className="py-6">
        <h1>Manage Restaurants</h1>
        <Link href="/superadmin/restaurants/new" className={actionBtnClass}>+ Add restaurant</Link>

        {restaurants.length === 0 && <p className="px-6 py-[60px] text-center text-[15px] text-text-muted">No restaurants yet. Add your first one.</p>}

        {restaurants.length > 0 && (
          <table className={tableClass}>
            <thead><tr><th className={thClass}>Name</th><th className={thClass}>Cuisine</th><th className={thClass}>Location</th><th className={thClass}>Actions</th></tr></thead>
            <tbody>
              {restaurants.map((r) => (
                <tr key={r.id}>
                  <td className={tdClass}>{r.name}</td>
                  <td className={tdClass}>{r.cuisine}</td>
                  <td className={tdClass}>{r.location}</td>
                  <td className={tdClass}>
                    <Link href={`/superadmin/restaurants/${r.id}/edit`} className="font-medium text-forest">Edit</Link>{' '}
                    <button className="cursor-pointer rounded-lg border-none bg-white px-3.5 py-2 text-[13px] text-danger shadow-card-sm" onClick={() => handleDelete(r.id)}>Delete</button>
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
