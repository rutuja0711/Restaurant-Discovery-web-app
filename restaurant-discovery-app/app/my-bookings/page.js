'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

const formClass = 'flex max-w-[420px] flex-col gap-3 rounded-[18px] bg-glass p-[22px] shadow-card-sm backdrop-blur-[14px]';
const inputClass = 'rounded-[10px] border-none bg-white px-4 py-3.5 text-sm shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-forest';
const buttonClass = 'cursor-pointer rounded-[10px] border-none bg-forest px-4 py-3.5 text-sm font-semibold text-white shadow-card-sm hover:bg-forest-dark disabled:opacity-70';

export default function MyBookings() {
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setError('');
    if (!phone.trim()) {
      setError('Please enter the phone number you used to book.');
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/bookings/lookup?phone=${encodeURIComponent(phone.trim())}`);
    const data = await res.json();
    setLoading(false);
    setBookings(data);
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1100px] px-0 py-6">
        <h1>Track Your Booking</h1>
        <p className="m-0 mb-1.5 text-[13px] text-text-muted">Enter the phone number you used when requesting a table.</p>

        <form onSubmit={handleSearch} className={formClass}>
          <input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          {error && <p className="-mt-1.5 text-[13px] text-danger">{error}</p>}
          <button type="submit" disabled={loading} className={buttonClass}>{loading ? 'Searching...' : 'Check status'}</button>
        </form>

        {bookings && bookings.length === 0 && (
          <p className="px-6 py-[60px] text-center text-[15px] text-text-muted">No bookings found for this phone number.</p>
        )}

        {bookings && bookings.length > 0 && (
          <div className="mt-6 flex flex-col gap-3.5">
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
