'use client';
import { useEffect, useState } from 'react';
import { useAdminOwnerGuard } from '@/lib/useAdminOwnerGuard';
import { useAdminRestaurants } from '@/lib/useAdminRestaurants';
import AdminSidebar from '@/components/AdminSidebar';
import LazyLoader from '@/components/LazyLoader';

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-forest-dark">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const checked = useAdminOwnerGuard();
  const { restaurants, selectedId, setSelectedId, loading: restaurantsLoading } = useAdminRestaurants();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checked || !selectedId) return;
    setLoading(true);
    fetch(`/api/admin/dashboard?restaurantId=${selectedId}`)
      .then((res) => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, [checked, selectedId]);

  if (!checked) return null;

  return (
    <AdminSidebar restaurants={restaurants} selectedId={selectedId} onSelectRestaurant={setSelectedId}>
      {restaurantsLoading ? (
        <LazyLoader message="Loading..." />
      ) : restaurants.length === 0 ? (
        <p className="text-text-muted">You don't have any restaurants yet. Add one to see your dashboard.</p>
      ) : loading || !stats ? (
        <LazyLoader message="Loading dashboard..." />
      ) : (
        <div className="grid grid-cols-4 gap-4 max-[1024px]:grid-cols-2 max-[480px]:grid-cols-1">
          <StatCard label="Total Bookings" value={stats.totalBookings} />
          <StatCard label="Today's Reservations" value={stats.todaysReservations} />
          <StatCard label="Pending Confirmations" value={stats.pendingConfirmations} />
          <StatCard label="Available Tables" value={stats.availableTables} />
          <StatCard label="Total Customers" value={stats.totalCustomers} />
          <StatCard label="Average Rating" value={stats.averageRating} />
        </div>
      )}
    </AdminSidebar>
  );
}
