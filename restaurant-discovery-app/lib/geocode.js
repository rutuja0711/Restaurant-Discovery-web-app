export async function geocodeAddress(address) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK' || !data.results.length) {
    return null;
  }

  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}
