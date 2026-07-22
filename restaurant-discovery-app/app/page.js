"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RestaurantListCard from "@/components/RestaurantListCard";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import CuisineExplore from "@/components/CuisineExplore";
import Footer from "@/components/Footer";
import NearMeButton from "@/components/NearMeButton";
import { getDistanceKm } from "@/lib/distance";
import PlacesLocationSearch from "@/components/PlacesLocationSearch";
import QuickFilterBar from "@/components/QuickFilterBar";
import FilterSidebar from "@/components/FilterSidebar";
import LazyLoader from "@/components/LazyLoader";

const filterInputClass =
  "rounded-[10px] border-none bg-white px-4 py-3 text-sm text-forest-dark shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-forest";

const PAGE_SIZE = 8;

const DEFAULT_FILTERS = {
  radiusKm: 5,
  cuisines: [],
  minRating: 0,
  costRange: [0, 5000],
  amenities: [],
  awardTiers: [],
  restaurantTypes: [],
  occasions: [],
  ambience: [],
};

export default function Home() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const nearMeActive = !!userCoords;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (location) params.set("location", location);
    if (filters.cuisines.length > 0) params.set("cuisines", filters.cuisines.join(","));
    if (filters.minRating > 0) params.set("minRating", filters.minRating);
    if (filters.costRange[0] > 0) params.set("costMin", filters.costRange[0]);
    if (filters.costRange[1] < 5000) params.set("costMax", filters.costRange[1]);
    if (filters.amenities.length > 0) params.set("amenities", filters.amenities.join(","));
    if (filters.awardTiers.length > 0) params.set("awardTiers", filters.awardTiers.join(","));
    if (filters.restaurantTypes.length > 0) params.set("restaurantTypes", filters.restaurantTypes.join(","));
    if (filters.occasions.length > 0) params.set("occasions", filters.occasions.join(","));
    if (filters.ambience.length > 0) params.set("ambience", filters.ambience.join(","));

    if (nearMeActive) {
      params.set("all", "true");
    } else {
      params.set("page", currentPage);
      params.set("limit", PAGE_SIZE);
    }

    fetch(`/api/restaurants?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data.restaurants) ? data.restaurants : [];
        setRestaurants(list);
        setTotalPages(nearMeActive ? 1 : data.totalPages || 1);
      })
      .catch(() => setError("Failed to load restaurants"))
      .finally(() => setLoading(false));
  }, [search, location, filters, nearMeActive, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, location, userCoords, filters]);

  function handleCuisineSelect(value) {
    setFilters((f) => ({
      ...f,
      cuisines: f.cuisines.includes(value) ? f.cuisines : [...f.cuisines, value],
    }));
    document.getElementById("listing")?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleQuickPill(pill) {
    setFilters((f) => ({
      ...f,
      amenities: f.amenities.includes(pill)
        ? f.amenities.filter((a) => a !== pill)
        : [...f.amenities, pill],
    }));
  }

  let displayedRestaurants = restaurants;
  let pageItems = restaurants;
  let effectiveTotalPages = totalPages;

  if (nearMeActive) {
    displayedRestaurants = restaurants
      .filter((r) => r.latitude && r.longitude)
      .map((r) => ({
        ...r,
        distanceKm: getDistanceKm(userCoords.lat, userCoords.lng, r.latitude, r.longitude),
      }))
      .filter((r) => r.distanceKm <= filters.radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    effectiveTotalPages = Math.ceil(displayedRestaurants.length / PAGE_SIZE);
    pageItems = displayedRestaurants.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
    );
  } else {
    pageItems = restaurants;
  }

  return (
    <>
      <Navbar />
      <HeroSlider onSearch={setSearch} />
      <CuisineExplore onSelect={handleCuisineSelect} />

      <main id="listing" className="mx-auto w-full max-w-[1300px] px-4 py-6 max-[480px]:px-3">
        <QuickFilterBar selected={filters.amenities} onToggle={toggleQuickPill} />

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${filterInputClass} max-w-[260px]`}
          />
          <NearMeButton onLocationFound={setUserCoords} />
          {userCoords && (
            <button
              className="cursor-pointer rounded-[10px] border-none bg-white px-[18px] py-2.5 text-[13px] font-medium text-forest-dark shadow-card-sm"
              onClick={() => setUserCoords(null)}
            >
              Clear nearby filter
            </button>
          )}
          <PlacesLocationSearch
            placeholder="Or search a location..."
            onPlaceSelected={({ lat, lng }) => setUserCoords({ lat, lng })}
          />
        </div>

        <div className="flex gap-7 max-[900px]:flex-col">
          <FilterSidebar filters={filters} onChange={setFilters} mapLocation={location} />

          <div className="min-w-0 flex-1">
            {loading && <LazyLoader message="Loading restaurants..." />}
            {error && <p>{error}</p>}
            {!loading && !error && pageItems.length === 0 && (
              <p>
                {nearMeActive
                  ? `No restaurants found within ${filters.radiusKm}km of you.`
                  : "No restaurants found."}
              </p>
            )}
            {!loading && !error && pageItems.length > 0 && (
              <>
                <div className="flex flex-col gap-5">
                  {pageItems.map((r) => (
                    <div
                      key={r.id}
                      role="link"
                      tabIndex={0}
                      onClick={() => router.push(`/restaurants/${r.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") router.push(`/restaurants/${r.id}`);
                      }}
                      className="block cursor-pointer"
                    >
                      <RestaurantListCard restaurant={r} />
                      {r.distanceKm !== undefined && (
                        <p className="my-1 text-xs text-text-muted">
                          {r.distanceKm.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {effectiveTotalPages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((p) => p - 1);
                        document.getElementById("listing")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="cursor-pointer rounded-[10px] border-none bg-white px-4 py-2.5 text-sm font-medium text-forest-dark shadow-card-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {Array.from({ length: effectiveTotalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => {
                          setCurrentPage(page);
                          document.getElementById("listing")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`cursor-pointer rounded-[10px] border-none px-3.5 py-2.5 text-sm font-medium shadow-card-sm ${
                          page === currentPage
                            ? "bg-forest text-white"
                            : "bg-white text-forest-dark hover:bg-forest/5"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={currentPage === effectiveTotalPages}
                      onClick={() => {
                        setCurrentPage((p) => p + 1);
                        document.getElementById("listing")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="cursor-pointer rounded-[10px] border-none bg-white px-4 py-2.5 text-sm font-medium text-forest-dark shadow-card-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
