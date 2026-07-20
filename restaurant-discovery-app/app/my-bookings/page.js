'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LazyLoader from '@/components/LazyLoader';
import { useUserGuard } from '@/lib/useUserGuard';

const statusLabels = {
  pending: 'Awaiting confirmation',
  confirmed: 'Confirmed',
  declined: 'Declined',
};

const statusColors = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-success',
  declined: 'bg-red-100 text-danger',
};

export default function MyBookings() {
  const { user, checked } = useUserGuard('/login?redirect=/my-bookings');
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checked) return;

    setLoading(true);
    fetch('/api/bookings/me')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load bookings');
        return res.json();
      })
      .then((data) => setBookings(data))
      .catch(() => setError('Could not load your bookings. Please try again.'))
      .finally(() => setLoading(false));
  }, [checked]);

  if (!checked) {
    return (
      <>
        <Navbar />
        <LazyLoader fullPage message="Checking your account..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1100px] px-0 py-6">
        <h1>My Bookings</h1>
        <p className="m-0 mb-6 text-[13px] text-text-muted">
          Hi {user.name}, here are your table reservations.
        </p>

        {loading && <LazyLoader message="Loading your bookings..." />}

        {!loading && error && (
          <p className="px-6 py-[60px] text-center text-[15px] text-danger">{error}</p>
        )}

        {!loading && !error && bookings?.length === 0 && (
          <p className="px-6 py-[60px] text-center text-[15px] text-text-muted">
            You have no bookings yet.{' '}
            <a href="/" className="font-medium text-forest">Browse restaurants</a> to book a table.
          </p>
        )}

        {!loading && !error && bookings?.length > 0 && (
          <div className="flex flex-col gap-3.5">
            {bookings.map((b) => (
              <div key={b.id} className="rounded-[14px] bg-white px-[18px] py-4 shadow-card-sm">
                <div className="mb-1.5 flex justify-between">
                  <strong>{b.restaurant.name}</strong>
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusColors[b.status] || 'bg-gray-100 text-gray-700'}`}>
                    {statusLabels[b.status]}
                  </span>
                </div>
                <p className="m-0">{b.bookingDate} at {b.bookingTime} · Party of {b.partySize}</p>
                <small className="text-text-muted">{b.restaurant.address}</small>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
