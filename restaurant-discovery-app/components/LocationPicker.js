'use client';
import { useEffect, useRef, useState } from 'react';

export default function LocationPicker({ initialLat, initialLng, onChange }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (cancelled || mapInstance.current) return;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const startLat = initialLat || 19.9975;
      const startLng = initialLng || 73.7898;

      const map = L.map(mapRef.current).setView([startLat, startLng], 14);
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      const marker = L.marker([startLat, startLng], { draggable: true }).addTo(map);
      markerInstance.current = marker;

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onChange({ lat: pos.lat, lng: pos.lng });
      });

      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      setReady(true);
    }

    initMap();
    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current && markerInstance.current && initialLat && initialLng) {
      mapInstance.current.setView([initialLat, initialLng], 15);
      markerInstance.current.setLatLng([initialLat, initialLng]);
    }
  }, [initialLat, initialLng]);

  return (
    <div>
      <div ref={mapRef} className="z-[1] h-[280px] rounded-[14px] shadow-card-sm" />
      {!ready && <p className="m-0 mb-1.5 text-[13px] text-text-muted">Loading map...</p>}
      <p className="m-0 mb-1.5 text-[13px] text-text-muted">We&apos;ve placed a pin based on your address, drag it if it&apos;s not quite right.</p>
    </div>
  );
}
