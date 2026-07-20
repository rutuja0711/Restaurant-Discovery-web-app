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
    <div className="flex flex-col">
      <button
        type="button"
        className="cursor-pointer rounded-[10px] border-none bg-forest px-[18px] py-2.5 text-[13px] font-semibold text-white shadow-card-sm disabled:cursor-wait disabled:opacity-70"
        onClick={handleClick}
        disabled={loading}
      >
        📍 {loading ? 'Finding you...' : 'Explore restaurants nearby'}
      </button>
      {error && <p className="-mt-1.5 text-[13px] text-danger">{error}</p>}
    </div>
  );
}
