'use client';
import { useEffect, useState } from 'react';
import { useAdminOwnerGuard } from '@/lib/useAdminOwnerGuard';
import { useAdminRestaurants } from '@/lib/useAdminRestaurants';
import AdminSidebar from '@/components/AdminSidebar';
import LazyLoader from '@/components/LazyLoader';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  arrived: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  cancelled: 'bg-black/10 text-text-muted',
};

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[status] || ''}`}>
      {status}
    </span>
  );
}

export default function AdminBookings() {
  const checked = useAdminOwnerGuard();
  const { restaurants, selectedId, setSelectedId, loading: restaurantsLoading } = useAdminRestaurants();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    if (!selectedId) return;
    setLoading(true);
    fetch(`/api/admin/bookings?restaurantId=${selectedId}`)
      .then((res) => res.json())
      .then(setBookings)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (checked && selectedId) load();
  }, [checked, selectedId]);

  async function updateStatus(id, status) {
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (!checked) return null;

  return (
    <AdminSidebar restaurants={restaurants} selectedId={selectedId} onSelectRestaurant={setSelectedId}>
      <h2 className="mb-5">Booking Management</h2>

      {restaurantsLoading ? (
        <LazyLoader message="Loading..." />
      ) : restaurants.length === 0 ? (
        <p className="text-text-muted">Add a restaurant first to manage bookings.</p>
      ) : loading ? (
        <LazyLoader message="Loading bookings..." />
      ) : bookings.length === 0 ? (
        <p className="text-text-muted">No booking requests yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-card-sm">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/8 text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Guests</th>
                <th className="px-4 py-3">Table</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const slot = new Date(b.slotStart);
                return (
                  <tr key={b.id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 font-medium text-forest-dark">{b.customerName}</td>
                    <td className="px-4 py-3 text-text-muted">{b.customerPhone}</td>
                    <td className="px-4 py-3">{slot.toLocaleDateString()}</td>
                    <td className="px-4 py-3">{slot.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</td>
                    <td className="px-4 py-3">{b.partySize}</td>
                    <td className="px-4 py-3">{b.table?.tableNumber || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(b.id, 'confirmed')} className="rounded-md bg-forest px-2.5 py-1 text-xs font-semibold text-white">Confirm</button>
                            <button onClick={() => updateStatus(b.id, 'declined')} className="rounded-md border border-danger px-2.5 py-1 text-xs font-semibold text-danger">Decline</button>
                          </>
                        )}
                        {b.status === 'confirmed' && (
                          <>
                            <button onClick={() => updateStatus(b.id, 'arrived')} className="rounded-md bg-forest px-2.5 py-1 text-xs font-semibold text-white">Mark Arrived</button>
                            <button onClick={() => updateStatus(b.id, 'cancelled')} className="rounded-md border border-danger px-2.5 py-1 text-xs font-semibold text-danger">Cancel</button>
                          </>
                        )}
                        {b.status === 'arrived' && (
                          <button onClick={() => updateStatus(b.id, 'completed')} className="rounded-md bg-forest px-2.5 py-1 text-xs font-semibold text-white">Mark Completed</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminSidebar>
  );
}
