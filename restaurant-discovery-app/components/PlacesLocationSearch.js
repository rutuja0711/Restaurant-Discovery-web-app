'use client';
import { useEffect, useRef, useState } from 'react';

export default function PlacesLocationSearch({ onPlaceSelected, placeholder = 'Search for a location...' }) {
  const inputRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function tryInit() {
      if (!window.google?.maps?.places || !inputRef.current) {
        setTimeout(tryInit, 300);
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          onPlaceSelected({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address,
            name: place.name,
          });
        }
      });

      setReady(true);
    }

    tryInit();
  }, [onPlaceSelected]);

  return (
    <div className="relative mb-4">
      <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-base">📍</span>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full rounded-[10px] border-none bg-white py-3 pr-4 pl-10 text-sm shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-forest"
      />
    </div>
  );
}
