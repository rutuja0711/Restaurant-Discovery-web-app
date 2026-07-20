'use client';
import { useEffect, useRef } from 'react';

export default function LocationSearch({ onPlaceSelected }) {
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
        autocomplete.placeholder = 'Search for area, street name...';

        autocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
          const place = placePrediction.toPlace();
          await place.fetchFields({
            fields: ['formattedAddress', 'location'],
          });

          const loc = place.location;
          if (!loc) return;

          onPlaceSelected({
            lat: typeof loc.lat === 'function' ? loc.lat() : loc.lat,
            lng: typeof loc.lng === 'function' ? loc.lng() : loc.lng,
            address: place.formattedAddress,
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
  }, [onPlaceSelected]);

  return <div ref={containerRef} className="places-search places-search-input w-full" />;
}
