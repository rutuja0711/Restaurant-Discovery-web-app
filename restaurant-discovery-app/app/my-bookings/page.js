'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const statusLabels = {
  pending: 'Awaiting confirmation',
  confirmed: 'Confirmed',
  declined: 'Declined',
};

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
      <main className="details-page">
        <h1>Track Your Booking</h1>
        <p className="wizard-hint">Enter the phone number you used when requesting a table.</p>

        <form onSubmit={handleSearch} className="review-form" style={{ maxWidth: 420 }}>
          <input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Searching...' : 'Check status'}</button>
        </form>

        {bookings && bookings.length === 0 && (
          <p className="state-msg">No bookings found for this phone number.</p>
        )}

        {bookings && bookings.length > 0 && (
          <div className="reviews-list" style={{ marginTop: 24 }}>
            {bookings.map((b) => (
              <div key={b.id} className="review-card">
                <div className="review-head">
                  <strong>{b.restaurant.name}</strong>
                  <span className={`status-badge status-${b.status}`}>{statusLabels[b.status]}</span>
                </div>
                <p>{b.bookingDate} at {b.bookingTime} · Party of {b.partySize}</p>
                <small>{b.restaurant.address}</small>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
