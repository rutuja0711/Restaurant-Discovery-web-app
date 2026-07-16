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

  return <input ref={inputRef} type="text" placeholder="Search for area, street name..." className="location-search-input" />;
}