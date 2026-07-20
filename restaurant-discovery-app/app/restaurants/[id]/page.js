"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LazyLoader from "@/components/LazyLoader";

const inputClass =
  "w-full rounded-[10px] border-none bg-white px-4 py-3.5 text-sm shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-forest";
const formClass =
  "my-4 mb-8 flex w-full max-w-[480px] flex-col gap-3 rounded-[18px] bg-glass p-[22px] shadow-card-sm backdrop-blur-[14px] max-[480px]:max-w-none max-[480px]:p-4";
const buttonClass =
  "cursor-pointer rounded-[10px] border-none bg-forest px-4 py-3.5 text-sm font-semibold text-white shadow-card-sm hover:bg-forest-dark disabled:opacity-70";
const tabClass = (active) =>
  `shrink-0 cursor-pointer border-none bg-transparent px-[18px] py-3 text-sm font-medium capitalize max-[480px]:px-3 max-[480px]:py-2.5 max-[480px]:text-[13px] ${
    active
      ? "border-b-2 border-forest text-forest"
      : "border-b-2 border-transparent text-text-muted"
  }`;

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewForm, setReviewForm] = useState({
    reviewerName: "",
    rating: 0,
    comment: "",
  });
  const [reviewError, setReviewError] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    customerName: "",
    customerPhone: "",
    partySize: 2,
    bookingDate: "",
    bookingTime: "",
    notes: "",
  });
  const [bookingError, setBookingError] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  function loadRestaurant() {
    fetch(`/api/restaurants/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setRestaurant(data))
      .catch(() => setError("Restaurant not found"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadRestaurant();
  }, [id]);

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewError("");
    if (
      !reviewForm.reviewerName.trim() ||
      !reviewForm.comment.trim() ||
      !reviewForm.rating
    ) {
      setReviewError("Please add your name, a star rating, and a comment.");
      return;
    }
    setReviewSubmitting(true);
    const res = await fetch(`/api/restaurants/${id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewForm),
    });
    setReviewSubmitting(false);
    if (res.ok) {
      setReviewForm({ reviewerName: "", rating: 0, comment: "" });
      loadRestaurant();
    } else {
      const data = await res.json();
      setReviewError(data.error || "Something went wrong");
    }
  }

  async function handleBookingSubmit(e) {
    e.preventDefault();
    setBookingError("");
    if (
      !bookingForm.customerName.trim() ||
      !bookingForm.customerPhone.trim() ||
      !bookingForm.bookingDate ||
      !bookingForm.bookingTime
    ) {
      setBookingError("Please fill in all required fields.");
      return;
    }
    setBookingSubmitting(true);
    const res = await fetch(`/api/restaurants/${id}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingForm),
    });
    setBookingSubmitting(false);
    if (res.ok) {
      setBookingSuccess(true);
      setBookingForm({
        customerName: "",
        customerPhone: "",
        partySize: 2,
        bookingDate: "",
        bookingTime: "",
        notes: "",
      });
    } else {
      const data = await res.json();
      setBookingError(data.error || "Something went wrong");
    }
  }

  if (loading)
    return (
      <>
        <Navbar />
        <LazyLoader fullPage message="Loading restaurant..." />
      </>
    );
  if (error)
    return (
      <>
        <Navbar />
        <p className="px-6 py-[60px] text-center text-[15px] text-text-muted">{error}</p>
      </>
    );

  const images =
    restaurant.images?.length > 0
      ? restaurant.images.map((img) => img.imageUrl)
      : [
          "https://picsum.photos/id/292/900/600",
          "https://picsum.photos/id/312/450/295",
          "https://picsum.photos/id/365/450/295",
        ];

  const mapQuery = encodeURIComponent(
    `${restaurant.address}, ${restaurant.location}`,
  );
  const mapSrc =
    restaurant.latitude && restaurant.longitude
      ? `https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}&output=embed`
      : `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  const directionsUrl =
    restaurant.latitude && restaurant.longitude
      ? `https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}`
      : `https://www.google.com/maps?q=${mapQuery}`;

  const cuisines = restaurant.cuisine.split(",").map((c) => c.trim());

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[1100px] px-2 py-6 max-[480px]:px-0 max-[480px]:py-4">
        <p className="mb-4 break-words text-[13px] leading-relaxed text-text-muted max-[480px]:text-xs">
          <a href="/" className="text-text-muted hover:text-forest">Home</a> /{" "}
          <a href={`/?location=${restaurant.location}`} className="text-text-muted hover:text-forest">
            {restaurant.location}
          </a>{" "}
          / {restaurant.name}
        </p>

        <div className="mb-5 flex items-start justify-between gap-4 max-[700px]:flex-col max-[700px]:gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="break-words">{restaurant.name}</h1>
            <p className="mt-1 text-sm text-text-muted">{cuisines.join(", ")}</p>
            <p className="mt-1 break-words text-sm text-text-muted">{restaurant.address}</p>
            <p className="mt-1 text-sm text-text-muted max-[480px]:flex max-[480px]:flex-col max-[480px]:gap-1">
              <span>{restaurant.openingHours}</span>
              <span className="max-[480px]:hidden"> · </span>
              <span>{restaurant.priceRange}</span>
              <span className="max-[480px]:hidden"> · </span>
              <span>{restaurant.contactNumber}</span>
            </p>
          </div>
          <div className="flex shrink-0 gap-2.5 max-[700px]:w-full max-[480px]:justify-start">
            <div className="min-w-[70px] rounded-[10px] bg-success px-3.5 py-2 text-center text-white">
              <span className="block text-[15px] font-bold">★ {restaurant.rating}</span>
              <small className="text-[10px] opacity-85">{restaurant.reviews?.length || 0} Ratings</small>
            </div>
          </div>
        </div>

        <div className="my-4 mb-5 flex flex-wrap gap-2.5">
          <a
            className="inline-block cursor-pointer rounded-[10px] border-none bg-white px-[18px] py-2.5 text-[13px] font-medium text-forest-dark shadow-card-sm no-underline"
            target="_blank"
            rel="noreferrer"
            href={directionsUrl}
          >
            Directions
          </a>
        </div>

        <div className="mb-7 grid h-[340px] grid-cols-[2fr_1fr] gap-3 overflow-hidden rounded-[20px] shadow-card-md max-[700px]:h-auto max-[700px]:grid-cols-1 max-[480px]:rounded-2xl">
          <div
            className="min-h-[220px] bg-cover bg-center max-[700px]:min-h-[240px] max-[480px]:min-h-[200px]"
            style={{ backgroundImage: `url(${images[0]})` }}
          />
          <div className="grid grid-rows-2 gap-3 max-[700px]:grid-cols-2 max-[700px]:grid-rows-[140px] max-[480px]:grid-rows-[120px]">
            {images.slice(1, 3).map((img, i) => {
              const isLast = i === 1;
              return (
                <div
                  key={i}
                  className="relative min-h-[120px] bg-cover bg-center max-[700px]:min-h-[140px] max-[480px]:min-h-[120px]"
                  style={{
                    backgroundImage: `url(${img})`,
                    cursor: isLast ? "pointer" : "default",
                  }}
                  onClick={isLast ? () => setActiveTab("photos") : undefined}
                >
                  {isLast && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-semibold text-white max-[480px]:text-xs">
                      View Gallery
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="-mx-2 mb-6 overflow-x-auto border-b border-black/8 max-[480px]:-mx-0">
          <div className="flex min-w-max gap-1 px-2 max-[480px]:gap-0 max-[480px]:px-0">
            {["overview", "menu", "photos", "reviews", "booking"].map((tab) => (
              <button
                key={tab}
                className={tabClass(activeTab === tab)}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "booking"
                  ? "Book a Table"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div>
            <h2 className="mt-0">About</h2>
            <p>{restaurant.description || "No description added yet."}</p>
            <div className="mt-6 grid grid-cols-2 gap-5 max-[480px]:grid-cols-1 max-[480px]:gap-4">
              <div>
                <h3 className="m-0 mb-1 font-sans text-[13px] tracking-wide text-text-muted uppercase">Price for two</h3>
                <p className="m-0 text-[15px]">{restaurant.priceRange || "—"}</p>
              </div>
              <div>
                <h3 className="m-0 mb-1 font-sans text-[13px] tracking-wide text-text-muted uppercase">Cuisine</h3>
                <p className="m-0 text-[15px]">{cuisines.join(", ")}</p>
              </div>
              <div>
                <h3 className="m-0 mb-1 font-sans text-[13px] tracking-wide text-text-muted uppercase">Opening hours</h3>
                <p className="m-0 text-[15px]">{restaurant.openingHours || "—"}</p>
              </div>
              <div>
                <h3 className="m-0 mb-1 font-sans text-[13px] tracking-wide text-text-muted uppercase">Contact</h3>
                <p className="m-0 text-[15px]">{restaurant.contactNumber || "—"}</p>
              </div>
            </div>
            <h2 className="mt-8">Location</h2>
            <div className="mt-4 overflow-hidden rounded-2xl shadow-card-md">
              <iframe
                title="restaurant-location"
                width="100%"
                height="320"
                className="h-[320px] w-full rounded-2xl border-0 max-[480px]:h-[240px]"
                loading="lazy"
                src={mapSrc}
              />
            </div>
          </div>
        )}

        {activeTab === "menu" && (
          <div>
            <h2 className="mt-0">Menu</h2>
            {restaurant.menuItems?.length > 0 ? (
              <div className="mt-4 flex flex-col gap-3">
                {restaurant.menuItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 rounded-xl bg-white px-[18px] py-3.5 text-sm shadow-card-sm max-[480px]:flex-col max-[480px]:gap-1 max-[480px]:px-4">
                    <span className="min-w-0 break-words">{item.name}</span>
                    <span className="shrink-0 font-semibold text-forest">{item.price}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-6 py-[60px] text-center text-[15px] text-text-muted">Menu not added yet.</p>
            )}
          </div>
        )}

        {activeTab === "photos" && (
          <div>
            <h2 className="mt-0">Photos</h2>
            <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5 max-[480px]:grid-cols-2 max-[480px]:gap-2.5">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="h-40 rounded-[14px] bg-cover bg-center shadow-card-sm max-[480px]:h-28 max-[480px]:rounded-xl"
                  style={{ backgroundImage: `url(${img})` }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h2 className="mt-0">Reviews</h2>

            <form className={formClass} onSubmit={handleReviewSubmit}>
              <h3 className="mt-0 font-sans text-[15px]">Leave a review</h3>
              <input
                placeholder="Your name"
                value={reviewForm.reviewerName}
                onChange={(e) =>
                  setReviewForm((p) => ({ ...p, reviewerName: e.target.value }))
                }
                className={inputClass}
              />
              <div className="my-1 flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`cursor-pointer border-none bg-transparent p-0 text-[26px] leading-none transition hover:scale-110 ${
                      n <= reviewForm.rating ? "text-accent-gold" : "text-[#d8d8d8]"
                    }`}
                    onClick={() => setReviewForm((p) => ({ ...p, rating: n }))}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Share your experience..."
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((p) => ({ ...p, comment: e.target.value }))
                }
                className={inputClass}
              />
              {reviewError && <p className="-mt-1.5 text-[13px] text-danger">{reviewError}</p>}
              <button type="submit" disabled={reviewSubmitting} className={buttonClass}>
                {reviewSubmitting ? "Posting..." : "Post review"}
              </button>
            </form>

            <div className="flex flex-col gap-3.5">
              {restaurant.reviews?.length > 0 ? (
                restaurant.reviews.map((r) => (
                  <div key={r.id} className="rounded-[14px] bg-white px-[18px] py-4 shadow-card-sm max-[480px]:px-4">
                    <div className="mb-1.5 flex items-start justify-between gap-3 max-[480px]:flex-col max-[480px]:gap-1">
                      <strong className="break-words">{r.reviewerName}</strong>
                      <span className="shrink-0 font-semibold text-accent-gold">★ {r.rating}</span>
                    </div>
                    <p className="m-0 break-words">{r.comment}</p>
                    <small className="text-text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                  </div>
                ))
              ) : (
                <p className="px-6 py-[60px] text-center text-[15px] text-text-muted">
                  No reviews yet. Be the first to review.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "booking" && (
          <div>
            <h2 className="mt-0">Book a Table</h2>
            {bookingSuccess ? (
              <p className="px-6 py-[60px] text-center text-[15px] text-text-muted">
                Request sent! The restaurant will confirm your booking shortly. Track its status anytime at{" "}
                <a href="/my-bookings" className="font-medium text-forest">My Bookings</a>.
              </p>
            ) : (
              <form className={formClass} onSubmit={handleBookingSubmit}>
                <input
                  placeholder="Your name"
                  value={bookingForm.customerName}
                  onChange={(e) =>
                    setBookingForm((p) => ({ ...p, customerName: e.target.value }))
                  }
                  className={inputClass}
                />
                <input
                  placeholder="Phone number"
                  value={bookingForm.customerPhone}
                  onChange={(e) =>
                    setBookingForm((p) => ({ ...p, customerPhone: e.target.value }))
                  }
                  className={inputClass}
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Party size"
                  value={bookingForm.partySize}
                  onChange={(e) =>
                    setBookingForm((p) => ({ ...p, partySize: e.target.value }))
                  }
                  className={inputClass}
                />
                <input
                  type="date"
                  value={bookingForm.bookingDate}
                  onChange={(e) =>
                    setBookingForm((p) => ({ ...p, bookingDate: e.target.value }))
                  }
                  className={inputClass}
                />
                <input
                  placeholder="Time"
                  type="time"
                  value={bookingForm.bookingTime}
                  onChange={(e) =>
                    setBookingForm((p) => ({ ...p, bookingTime: e.target.value }))
                  }
                  className={inputClass}
                />
                <textarea
                  placeholder="Any special requests? (optional)"
                  value={bookingForm.notes}
                  onChange={(e) =>
                    setBookingForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  className={inputClass}
                />
                {bookingError && <p className="-mt-1.5 text-[13px] text-danger">{bookingError}</p>}
                <button type="submit" disabled={bookingSubmitting} className={buttonClass}>
                  {bookingSubmitting ? "Sending..." : "Request booking"}
                </button>
              </form>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
