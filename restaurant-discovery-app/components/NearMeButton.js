'use client';
import { useState } from 'react';

export default function NearMeButton({ onLocationFound }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleClick() {
    if (!navigator.geolocation) {
      setError('Location not supported on this browser');
      return;
    }
    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        onLocationFound({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => {
        setLoading(false);
        setError('Could not get your location. Please allow location access.');
      }
    );
  }

  return (
    <div className="near-me-wrap">
      <button type="button" className="near-me-btn" onClick={handleClick} disabled={loading}>
        📍 {loading ? 'Finding you...' : 'Explore restaurants nearby'}
      </button>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
