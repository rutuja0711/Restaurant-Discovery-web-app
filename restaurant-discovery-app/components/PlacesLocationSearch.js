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
    <div className="search-suggest-input">
      <span className="search-suggest-icon">📍</span>
      <input ref={inputRef} type="text" placeholder={placeholder} />
    </div>
  );
}
