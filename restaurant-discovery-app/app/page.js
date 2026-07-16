"use client";
import { useEffect, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import CuisineExplore from "@/components/CuisineExplore";
import Footer from "@/components/Footer";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [cuisine, setCuisine] = useState("");

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

  return (
    <>
      <Navbar />
      <HeroSlider onSearch={setSearch} />
      <CuisineExplore onSelect={setCuisine} />

      <main id="listing">
        <h2 className="section-title">
          {cuisine ? `${cuisine} restaurants` : "All restaurants"}
          
        </h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
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
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            <option value="">Pet Friendly</option>
          </select>
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            <option value="">Outdoor Sitting  </option>
          </select>
               <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            <option value="">Rating : 4.5 and above </option>
          </select><select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            <option value="">Serves Alcohol </option>
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
        {!loading && !error && restaurants.length === 0 && (
          <p>No restaurants found.</p>
        )}

        {!loading && !error && restaurants.length > 0 && (
          <div className="grid">
            {restaurants.map((r) => (
              <a key={r.id} href={`/restaurants/${r.id}`}>
                <RestaurantCard restaurant={r} />
              </a>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
