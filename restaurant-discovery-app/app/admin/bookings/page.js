'use client';
import { useEffect, useState } from 'react';
import { useAdminOwnerGuard } from '@/lib/useAdminOwnerGuard';
import Navbar from '@/components/Navbar';
import LazyLoader from '@/components/LazyLoader';

const tableClass = 'mt-5 w-full border-separate border-spacing-0 overflow-hidden rounded-2xl bg-white shadow-card-md';
const thClass = 'bg-forest px-4 py-4 text-left text-sm font-semibold text-white';
const tdClass = 'border-b border-black/4 px-4 py-4 text-left text-sm';

export default function AdminBookings() {
  const checked = useAdminOwnerGuard();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch('/api/admin/bookings').then((res) => res.json()).then(setBookings).finally(() => setLoading(false));
  }

  useEffect(() => { if (checked) load(); }, [checked]);

  async function updateStatus(id, status) {
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    });
    load();
  }

  if (!checked) return null;
  if (loading) return <><Navbar /><LazyLoader fullPage message="Loading bookings..." /></>;

  return (
    <>
      <Navbar />
      <main className="py-6">
        <h1>Booking Requests</h1>
        {bookings.length === 0 && <p className="px-6 py-[60px] text-center text-[15px] text-text-muted">No booking requests yet.</p>}
        {bookings.length > 0 && (
          <table className={tableClass}>
            <thead><tr><th className={thClass}>Restaurant</th><th className={thClass}>Name</th><th className={thClass}>Phone</th><th className={thClass}>Party</th><th className={thClass}>Date</th><th className={thClass}>Time</th><th className={thClass}>Status</th><th className={thClass}>Actions</th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className={tdClass}>{b.restaurant.name}</td>
                  <td className={tdClass}>{b.customerName}</td>
                  <td className={tdClass}>{b.customerPhone}</td>
                  <td className={tdClass}>{b.partySize}</td>
                  <td className={tdClass}>{b.bookingDate}</td>
                  <td className={tdClass}>{b.bookingTime}</td>
                  <td className={tdClass}>{b.status}</td>
                  <td className={tdClass}>
                    {b.status === 'pending' && (
                      <>
                        <button className="cursor-pointer rounded-lg border-none bg-white px-3.5 py-2 text-[13px] text-danger shadow-card-sm" onClick={() => updateStatus(b.id, 'confirmed')}>Confirm</button>{' '}
                        <button className="cursor-pointer rounded-lg border-none bg-white px-3.5 py-2 text-[13px] text-danger shadow-card-sm" onClick={() => updateStatus(b.id, 'declined')}>Decline</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}
