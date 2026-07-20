'use client';
import { useEffect, useRef } from 'react';

export default function LocationSearch({ onPlaceSelected }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, { types: ['geocode'] });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onPlaceSelected({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address,
        });
      }
    });
  }, [onPlaceSelected]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search for area, street name..."
      className="w-full rounded-[10px] border-none bg-white px-4 py-3 text-sm shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-forest"
    />
  );
}
