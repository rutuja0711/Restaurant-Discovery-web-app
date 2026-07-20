'use client';
import { useEffect, useState } from 'react';
import { useAdminOwnerGuard } from '@/lib/useAdminOwnerGuard';
import Navbar from '@/components/Navbar';

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
  if (loading) return <><Navbar /><p className="state-msg">Loading...</p></>;

  return (
    <>
      <Navbar />
      <main className="admin-page">
        <h1>Booking Requests</h1>
        {bookings.length === 0 && <p className="state-msg">No booking requests yet.</p>}
        {bookings.length > 0 && (
          <table>
            <thead><tr><th>Restaurant</th><th>Name</th><th>Phone</th><th>Party</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.restaurant.name}</td>
                  <td>{b.customerName}</td>
                  <td>{b.customerPhone}</td>
                  <td>{b.partySize}</td>
                  <td>{b.bookingDate}</td>
                  <td>{b.bookingTime}</td>
                  <td>{b.status}</td>
                  <td>
                    {b.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(b.id, 'confirmed')}>Confirm</button>{' '}
                        <button onClick={() => updateStatus(b.id, 'declined')}>Decline</button>
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
