"use client";
import { useEffect, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import CuisineExplore from "@/components/CuisineExplore";
import Footer from "@/components/Footer";
import NearMeButton from "@/components/NearMeButton";
import { getDistanceKm } from "@/lib/distance";
import PlacesLocationSearch from "@/components/PlacesLocationSearch";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [radiusKm, setRadiusKm] = useState(5);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    if (cuisine) params.set("cuisine", cuisine);
    fetch(`/api/restaurants?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch(() => setError("Failed to load restaurants"))
      .finally(() => setLoading(false));
  }, [search, location, cuisine]);

  let displayedRestaurants = restaurants;

  if (userCoords) {
    displayedRestaurants = restaurants
      .filter((r) => r.latitude && r.longitude)
      .map((r) => ({
        ...r,
        distanceKm: getDistanceKm(userCoords.lat, userCoords.lng, r.latitude, r.longitude),
      }))
      .filter((r) => r.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return (
    <>
      <Navbar />
      <HeroSlider onSearch={setSearch} />
      <CuisineExplore onSelect={setCuisine} />
      <main id="listing">
        <div className="listing-header">
          <h2 className="section-title">
            {userCoords ? "Restaurants near you" : cuisine ? `${cuisine} restaurants` : "All restaurants"}
          </h2>
          <NearMeButton onLocationFound={setUserCoords} />
          {userCoords && (
            <>
              <select value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} className="radius-select">
                <option value={1}>Within 1 km</option>
                <option value={3}>Within 3 km</option>
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={15}>Within 15 km</option>
                <option value={25}>Within 25 km</option>
              </select>
              <button className="action-btn" onClick={() => setUserCoords(null)}>Clear nearby filter</button>
            </>
          )}
        </div>

        <PlacesLocationSearch
  placeholder="Or search a location..."
  onPlaceSelected={({ lat, lng }) => setUserCoords({ lat, lng })}
/>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">All locations</option>
            <option value="Nashik">Nashik</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
          </select>
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            <option value="">All cuisines</option>
            <option value="North Indian">North Indian</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
            <option value="South Indian">South Indian</option>
            <option value="American">American</option>
          </select>
         
          {(search || location || cuisine) && (
            <button
              onClick={() => {
                setSearch("");
                setLocation("");
                setCuisine("");
              }}
            >
              clear Filters
            </button>
          )}
        </div>

        {loading && <p>Loading restaurants...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && displayedRestaurants.length === 0 && (
          <p>{userCoords ? `No restaurants found within ${radiusKm}km of you.` : "No restaurants found."}</p>
        )}
        {!loading && !error && displayedRestaurants.length > 0 && (
          <div className="grid">
            {displayedRestaurants.map((r) => (
              <a key={r.id} href={`/restaurants/${r.id}`}>
                <RestaurantCard restaurant={r} />
                {r.distanceKm !== undefined && (
                  <p className="distance-tag">{r.distanceKm.toFixed(1)} km away</p>
                )}
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
