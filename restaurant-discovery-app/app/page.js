// "use client";
// import { useEffect, useState } from "react";
// import RestaurantCard from "@/components/RestaurantCard";
// import Navbar from "@/components/Navbar";
// import HeroSlider from "@/components/HeroSlider";
// import CuisineExplore from "@/components/CuisineExplore";
// import Footer from "@/components/Footer";
// import NearMeButton from "@/components/NearMeButton";
// import { getDistanceKm } from "@/lib/distance";
// import PlacesLocationSearch from "@/components/PlacesLocationSearch";
// import FilterDropdown from "@/components/FilterDropdown";
// import LazyLoader from "@/components/LazyLoader";
// const filterInputClass =
//   "rounded-[10px] border-none bg-white px-4 py-3 text-sm text-forest-dark shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-forest";

// const PAGE_SIZE = 8;

// export default function Home() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [location, setLocation] = useState("");
//   const [cuisine, setCuisine] = useState("");
//   const [userCoords, setUserCoords] = useState(null);
//   const [radiusKm, setRadiusKm] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     setLoading(true);
//     const params = new URLSearchParams();
//     if (search) params.set("search", search);
//     if (location) params.set("location", location);
//     if (cuisine) params.set("cuisine", cuisine);
//     fetch(`/api/restaurants?${params.toString()}`)
//       .then((res) => res.json())
//       .then((data) => setRestaurants(data))
//       .catch(() => setError("Failed to load restaurants"))
//       .finally(() => setLoading(false));
//   }, [search, location, cuisine]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, location, cuisine, userCoords, radiusKm]);

//   let displayedRestaurants = restaurants;

//   if (userCoords) {
//     displayedRestaurants = restaurants
//       .filter((r) => r.latitude && r.longitude)
//       .map((r) => ({
//         ...r,
//         distanceKm: getDistanceKm(
//           userCoords.lat,
//           userCoords.lng,
//           r.latitude,
//           r.longitude,
//         ),
//       }))
//       .filter((r) => r.distanceKm <= radiusKm)
//       .sort((a, b) => a.distanceKm - b.distanceKm);
//   }

//   const totalPages = Math.ceil(displayedRestaurants.length / PAGE_SIZE);
//   const paginatedRestaurants = displayedRestaurants.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE,
//   );
//   function handleCuisineSelect(value) {
//     setCuisine(value);
//     document.getElementById("listing")?.scrollIntoView({ behavior: "smooth" });
//   }
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, location, cuisine, userCoords, radiusKm]);
  
//   function handleCuisineSelect(value) {
//     setCuisine(value);
//     document.getElementById("listing")?.scrollIntoView({ behavior: "smooth" });
//   }
//   return (
//     <>
//       <Navbar />
//       <HeroSlider onSearch={setSearch} />
//       <CuisineExplore onSelect={handleCuisineSelect} />
//       <main id="listing">
//         <div className="mb-4 flex flex-wrap items-center gap-3.5">
//           <h2>
//             {userCoords
//               ? "Restaurants near you"
//               : cuisine
//                 ? `${cuisine} restaurants`
//                 : "All restaurants"}
//           </h2>
//           <NearMeButton onLocationFound={setUserCoords} />
//           {userCoords && (
//             <>
//               <select
//                 value={radiusKm}
//                 onChange={(e) => setRadiusKm(Number(e.target.value))}
//                 className="cursor-pointer rounded-[10px] border-none bg-white px-3.5 py-2.5 text-[13px] shadow-card-sm"
//               >
//                 <option value={1}>Within 1 km</option>
//                 <option value={3}>Within 3 km</option>
//                 <option value={5}>Within 5 km</option>
//                 <option value={10}>Within 10 km</option>
//                 <option value={15}>Within 15 km</option>
//                 <option value={25}>Within 25 km</option>
//               </select>
//               <button
//                 className="cursor-pointer rounded-[10px] border-none bg-white px-[18px] py-2.5 text-[13px] font-medium text-forest-dark shadow-card-sm no-underline"
//                 onClick={() => setUserCoords(null)}
//               >
//                 Clear nearby filter
//               </button>
//             </>
//           )}
//         </div>

//         <PlacesLocationSearch
//           placeholder="Or search a location..."
//           onPlaceSelected={({ lat, lng }) => setUserCoords({ lat, lng })}
//         />

//         <div className=" relative z-20  mb-8 flex flex-wrap items-center gap-3 rounded-[18px] bg-glass p-4 shadow-card-sm backdrop-blur-[12px] max-[480px]:flex-col">
//           <input
//             type="text"
//             placeholder="Search by name..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className={`${filterInputClass} max-[480px]:w-full`}
//           />

//           <FilterDropdown
//             label="All cuisines"
//             value={cuisine}
//             onChange={setCuisine}
//             options={[
//               { value: "", label: "All cuisines" },
//               { value: "North Indian", label: "North Indian" },
//               { value: "Italian", label: "Italian" },
//               { value: "Chinese", label: "Chinese" },
//               { value: "South Indian", label: "South Indian" },
//               { value: "American", label: "American" },
//             ]}
//           />

//           <FilterDropdown
//             label="All locations"
//             value={location}
//             onChange={setLocation}
//             options={[
//               { value: "", label: "All locations" },
//               { value: "Nashik", label: "Nashik" },
//               { value: "Pune", label: "Pune" },
//               { value: "Mumbai", label: "Mumbai" },
//             ]}
//           />

//           {(search || location || cuisine) && (
//             <button
//               className="cursor-pointer rounded-[10px] border-none bg-forest px-4 py-3 text-sm font-semibold text-white shadow-card-sm hover:bg-forest-dark"
//               onClick={() => {
//                 setSearch("");
//                 setLocation("");
//                 setCuisine("");
//               }}
//             >
//               Clear Filters
//             </button>
//           )}
//         </div>

//         {loading && <LazyLoader message="Loading restaurants..." />}
//         {error && <p>{error}</p>}
//         {!loading && !error && displayedRestaurants.length === 0 && (
//           <p>
//             {userCoords
//               ? `No restaurants found within ${radiusKm}km of you.`
//               : "No restaurants found."}
//           </p>
//         )}
//         {!loading && !error && displayedRestaurants.length > 0 && (
//           <>
//           <div className="grid grid-cols-4 gap-[22px] max-[1024px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
//               {paginatedRestaurants.map((r) => (
//                 <a key={r.id} href={`/restaurants/${r.id}`}>
//                   <RestaurantCard restaurant={r} />
//                   {r.distanceKm !== undefined && (
//                     <p className="my-1 text-xs text-text-muted">
//                       {r.distanceKm.toFixed(1)} km away
//                     </p>
//                   )}
//                 </a>
//               ))}
//             </div>

//             {totalPages > 1 && (
//               <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
//                 <button
//                   type="button"
//                   disabled={currentPage === 1}
//                   onClick={() => {
//                     setCurrentPage((p) => p - 1);
//                     document
//                       .getElementById("listing")
//                       ?.scrollIntoView({ behavior: "smooth" });
//                   }}
//                   className="cursor-pointer rounded-[10px] border-none bg-white px-4 py-2.5 text-sm font-medium text-forest-dark shadow-card-sm disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   Previous
//                 </button>

//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                   (page) => (
//                     <button
//                       key={page}
//                       type="button"
//                       onClick={() => {
//                         setCurrentPage(page);
//                         document
//                           .getElementById("listing")
//                           ?.scrollIntoView({ behavior: "smooth" });
//                       }}
//                       className={`cursor-pointer rounded-[10px] border-none px-3.5 py-2.5 text-sm font-medium shadow-card-sm ${
//                         page === currentPage
//                           ? "bg-forest text-white"
//                           : "bg-white text-forest-dark hover:bg-forest/5"
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ),
//                 )}

//                 <button
//                   type="button"
//                   disabled={currentPage === totalPages}
//                   onClick={() => {
//                     setCurrentPage((p) => p + 1);
//                     document
//                       .getElementById("listing")
//                       ?.scrollIntoView({ behavior: "smooth" });
//                   }}
//                   className="cursor-pointer rounded-[10px] border-none bg-white px-4 py-2.5 text-sm font-medium text-forest-dark shadow-card-sm disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </main>
//       <Footer />
//     </>
//   );
// }


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
import FilterDropdown from "@/components/FilterDropdown";
import FiltersModal from "@/components/FiltersModal";
import LazyLoader from "@/components/LazyLoader";
const filterInputClass =
  "rounded-[10px] border-none bg-white px-4 py-3 text-sm text-forest-dark shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-forest";

const PAGE_SIZE = 8;

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [radiusKm, setRadiusKm] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    sortBy: "popularity",
    cuisines: [],
    minRating: 0,
    costRange: [0, 5000],
    amenities: [],
  });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    if (cuisine) params.set("cuisine", cuisine);

    if (advancedFilters.sortBy) params.set("sortBy", advancedFilters.sortBy);
    if (advancedFilters.cuisines.length > 0)
      params.set("cuisines", advancedFilters.cuisines.join(","));
    if (advancedFilters.minRating > 0)
      params.set("minRating", advancedFilters.minRating);
    if (advancedFilters.costRange[0] > 0)
      params.set("costMin", advancedFilters.costRange[0]);
    if (advancedFilters.costRange[1] < 5000)
      params.set("costMax", advancedFilters.costRange[1]);
    if (advancedFilters.amenities.length > 0)
      params.set("amenities", advancedFilters.amenities.join(","));

    fetch(`/api/restaurants?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch(() => setError("Failed to load restaurants"))
      .finally(() => setLoading(false));
  }, [search, location, cuisine, advancedFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, location, cuisine, userCoords, radiusKm, advancedFilters]);

  function handleCuisineSelect(value) {
    setCuisine(value);
    document.getElementById("listing")?.scrollIntoView({ behavior: "smooth" });
  }

  const advancedFiltersActive =
    advancedFilters.cuisines.length > 0 ||
    advancedFilters.minRating > 0 ||
    advancedFilters.costRange[0] > 0 ||
    advancedFilters.costRange[1] < 5000 ||
    advancedFilters.amenities.length > 0 ||
    advancedFilters.sortBy !== "popularity";

  let displayedRestaurants = restaurants;

  if (userCoords) {
    displayedRestaurants = restaurants
      .filter((r) => r.latitude && r.longitude)
      .map((r) => ({
        ...r,
        distanceKm: getDistanceKm(
          userCoords.lat,
          userCoords.lng,
          r.latitude,
          r.longitude,
        ),
      }))
      .filter((r) => r.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  const totalPages = Math.ceil(displayedRestaurants.length / PAGE_SIZE);
  const paginatedRestaurants = displayedRestaurants.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <>
      <Navbar />
      <HeroSlider onSearch={setSearch} />
      <CuisineExplore onSelect={handleCuisineSelect} />
      <main id="listing">
        <div className="mb-4 flex flex-wrap items-center gap-3.5">
          <h2>
            {userCoords
              ? "Restaurants near you"
              : cuisine
                ? `${cuisine} restaurants`
                : "All restaurants"}
          </h2>
          <NearMeButton onLocationFound={setUserCoords} />
          {userCoords && (
            <button
              className="cursor-pointer rounded-[10px] border-none bg-white px-[18px] py-2.5 text-[13px] font-medium text-forest-dark shadow-card-sm no-underline"
              onClick={() => setUserCoords(null)}
            >
              Clear nearby filter
            </button>
          )}
        </div>

        <PlacesLocationSearch
          placeholder="Or search a location..."
          onPlaceSelected={({ lat, lng }) => setUserCoords({ lat, lng })}
        />

        <div className=" relative z-20  mb-8 flex flex-wrap items-center gap-3 rounded-[18px] bg-glass p-4 shadow-card-sm backdrop-blur-[12px] max-[480px]:flex-col">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${filterInputClass} max-[480px]:w-full`}
          />

          <FilterDropdown
            label="All cuisines"
            value={cuisine}
            onChange={setCuisine}
            options={[
              { value: "", label: "All cuisines" },
              { value: "North Indian", label: "North Indian" },
              { value: "Italian", label: "Italian" },
              { value: "Chinese", label: "Chinese" },
              { value: "South Indian", label: "South Indian" },
              { value: "American", label: "American" },
            ]}
          />

          <FilterDropdown
            label="All locations"
            value={location}
            onChange={setLocation}
            options={[
              { value: "", label: "All locations" },
              { value: "Nashik", label: "Nashik" },
              { value: "Pune", label: "Pune" },
              { value: "Mumbai", label: "Mumbai" },
            ]}
          />

          <button
            onClick={() => setFiltersOpen(true)}
            className={`cursor-pointer rounded-[10px] border px-4 py-3 text-sm font-medium shadow-card-sm ${
              advancedFiltersActive
                ? "border-forest bg-forest/10 text-forest"
                : "border-transparent bg-white text-forest-dark"
            }`}
          >
            Filters{advancedFiltersActive ? " •" : ""}
          </button>

          {(search || location || cuisine || advancedFiltersActive) && (
            <button
              className="cursor-pointer rounded-[10px] border-none bg-forest px-4 py-3 text-sm font-semibold text-white shadow-card-sm hover:bg-forest-dark"
              onClick={() => {
                setSearch("");
                setLocation("");
                setCuisine("");
                setAdvancedFilters({
                  sortBy: "popularity",
                  cuisines: [],
                  minRating: 0,
                  costRange: [0, 5000],
                  amenities: [],
                });
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {filtersOpen && (
          <FiltersModal
            initialFilters={advancedFilters}
            onApply={setAdvancedFilters}
            onClose={() => setFiltersOpen(false)}
          />
        )}

        {loading && <LazyLoader message="Loading restaurants..." />}
        {error && <p>{error}</p>}
        {!loading && !error && displayedRestaurants.length === 0 && (
          <p>
            {userCoords
              ? `No restaurants found within ${radiusKm}km of you.`
              : "No restaurants found."}
          </p>
        )}
        {!loading && !error && displayedRestaurants.length > 0 && (
          <>
          <div className="grid grid-cols-4 gap-[22px] max-[1024px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
              {paginatedRestaurants.map((r) => (
                <a key={r.id} href={`/restaurants/${r.id}`}>
                  <RestaurantCard restaurant={r} />
                  {r.distanceKm !== undefined && (
                    <p className="my-1 text-xs text-text-muted">
                      {r.distanceKm.toFixed(1)} km away
                    </p>
                  )}
                </a>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => p - 1);
                    document
                      .getElementById("listing")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="cursor-pointer rounded-[10px] border-none bg-white px-4 py-2.5 text-sm font-medium text-forest-dark shadow-card-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => {
                        setCurrentPage(page);
                        document
                          .getElementById("listing")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`cursor-pointer rounded-[10px] border-none px-3.5 py-2.5 text-sm font-medium shadow-card-sm ${
                        page === currentPage
                          ? "bg-forest text-white"
                          : "bg-white text-forest-dark hover:bg-forest/5"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => p + 1);
                    document
                      .getElementById("listing")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="cursor-pointer rounded-[10px] border-none bg-white px-4 py-2.5 text-sm font-medium text-forest-dark shadow-card-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

