'use client';
import { useEffect, useState } from 'react';
import { useAdminOwnerGuard } from '@/lib/useAdminOwnerGuard';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ConfirmationModal from '@/components/ConfirmationModal';

const actionBtnClass = 'inline-block cursor-pointer rounded-[10px] border-none bg-white px-[18px] py-2.5 text-[13px] font-medium text-forest-dark shadow-card-sm no-underline';
const tableClass = 'mt-5 w-full border-separate border-spacing-0 overflow-hidden rounded-2xl bg-white shadow-card-md';
const thClass = 'bg-forest px-4 py-4 text-left text-sm font-semibold text-white';
const tdClass = 'border-b border-black/4 px-4 py-4 text-left text-sm';

export default function AdminDashboard() {
  const checked = useAdminOwnerGuard();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!checked) return;
    fetch('/api/admin/restaurants').then((res) => res.json()).then(setRestaurants).finally(() => setLoading(false));
  }, [checked]);

  async function handleDelete(id) {
    if (!confirm('Delete this restaurant?')) return;
    await fetch(`/api/admin/restaurants/${id}`, { method: 'DELETE' });
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
    setShowModal(true);
  }

  if (!checked) return null;
  if (loading) return <><Navbar /><p className="px-6 py-[60px] text-center text-[15px] text-text-muted">Loading...</p></>;

  return (
    <>
      <Navbar />
      <main className="py-6">
        <h1>Manage My Restaurant</h1>

        {restaurants.length === 0 && <p className="px-6 py-[60px] text-center text-[15px] text-text-muted">You haven&apos;t added any restaurants yet.</p>}

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
                    <Link href={`/admin/restaurants/${r.id}/edit`} className="font-medium text-forest">Edit</Link>{' '}
                    <button className="cursor-pointer rounded-lg border-none bg-white px-3.5 py-2 text-[13px] text-danger shadow-card-sm" onClick={() => handleDelete(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link href="/admin/restaurants/new" className={`${actionBtnClass} bg-forest text-white`}>+ Add restaurant</Link>
          <Link href="/admin/bookings" className={actionBtnClass}>View bookings</Link>
        </div>

        <ConfirmationModal
          open={showModal}
          title="Restaurant deleted"
          message="Your listing has been removed."
          onClose={() => setShowModal(false)}
        />
      </main>
    </>
  );
}
