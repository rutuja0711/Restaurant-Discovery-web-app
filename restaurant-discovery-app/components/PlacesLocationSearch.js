'use client';
import { useEffect, useRef } from 'react';

export default function PlacesLocationSearch({ onPlaceSelected, placeholder = 'Search for a location...' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let autocomplete = null;
    let cancelled = false;

    async function init() {
      if (!window.google?.maps?.importLibrary) {
        setTimeout(init, 300);
        return;
      }
      if (!containerRef.current || cancelled) return;

      try {
        const { PlaceAutocompleteElement } = await window.google.maps.importLibrary('places');
        if (cancelled || !containerRef.current) return;

        autocomplete = new PlaceAutocompleteElement({
          includedRegionCodes: ['in'],
        });
        autocomplete.placeholder = placeholder;

        autocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
          const place = placePrediction.toPlace();
          await place.fetchFields({
            fields: ['displayName', 'formattedAddress', 'location'],
          });

          const loc = place.location;
          if (!loc) return;

          onPlaceSelected({
            lat: typeof loc.lat === 'function' ? loc.lat() : loc.lat,
            lng: typeof loc.lng === 'function' ? loc.lng() : loc.lng,
            address: place.formattedAddress,
            name: place.displayName,
          });
        });

        containerRef.current.replaceChildren(autocomplete);
      } catch (err) {
        console.error('Failed to initialize Places Autocomplete:', err);
      }
    }

    init();

    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.replaceChildren();
    };
  }, [onPlaceSelected, placeholder]);

  return (
    <div className="places-search relative mb-4">
      <span className="pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-base">📍</span>
      <div ref={containerRef} className="places-search-input" />
    </div>
  );
}
