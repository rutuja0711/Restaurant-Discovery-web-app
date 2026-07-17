'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewForm, setReviewForm] = useState({ reviewerName: '', rating: 0, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  function loadRestaurant() {
    fetch(`/api/restaurants/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setRestaurant(data))
      .catch(() => setError('Restaurant not found'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadRestaurant(); }, [id]);

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewError('');
    if (!reviewForm.reviewerName.trim() || !reviewForm.comment.trim() || !reviewForm.rating) {
      setReviewError('Please add your name, a star rating, and a comment.');
      return;
    }
    setReviewSubmitting(true);
    const res = await fetch(`/api/restaurants/${id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewForm),
    });
    setReviewSubmitting(false);
    if (res.ok) {
      setReviewForm({ reviewerName: '', rating: 0, comment: '' });
      loadRestaurant();
    } else {
      const data = await res.json();
      setReviewError(data.error || 'Something went wrong');
    }
  }

  if (loading) return <><Navbar /><p className="state-msg">Loading restaurant...</p></>;
  if (error) return <><Navbar /><p className="state-msg">{error}</p></>;

  const images = restaurant.images?.length > 0
    ? restaurant.images.map((img) => img.imageUrl)
    : ['https://picsum.photos/id/292/900/600', 'https://picsum.photos/id/312/450/295', 'https://picsum.photos/id/365/450/295'];

  const mapQuery = encodeURIComponent(`${restaurant.address}, ${restaurant.location}`);
  const mapSrc = restaurant.latitude && restaurant.longitude
    ? `https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}&output=embed`
    : `https://www.google.com/maps?q=${mapQuery}&output=embed`;

    const directionsUrl = restaurant.latitude && restaurant.longitude
    ? `https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}`
    : `https://www.google.com/maps?q=${mapQuery}`;

  const cuisines = restaurant.cuisine.split(',').map((c) => c.trim());

  return (
    <>
      <Navbar />
      <main className="details-page">
        <p className="breadcrumb">
          <a href="/">Home</a> / <a href={`/?location=${restaurant.location}`}>{restaurant.location}</a> / {restaurant.name}
        </p>

        <div className="details-header">
          <div>
            <h1>{restaurant.name}</h1>
            <p className="details-subline">{cuisines.join(', ')}</p>
            <p className="details-subline">{restaurant.address}</p>
            <p className="details-subline">{restaurant.openingHours} · {restaurant.priceRange} · {restaurant.contactNumber}</p>
          </div>
          <div className="rating-badge-group">
            <div className="rating-badge">
              <span>★ {restaurant.rating}</span>
              <small>{restaurant.reviews?.length || 0} Ratings</small>
            </div>
          </div>
        </div>

        <div className="action-row">
          {/* <a className="action-btn" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${mapQuery}`}>Directions</a> */}
          <a className="action-btn" target="_blank" rel="noreferrer" href={directionsUrl}>Directions</a>
          {/* <button className="action-btn" onClick={() => setActiveTab('reviews')}>Reviews</button>
          <button className="action-btn primary" onClick={() => setActiveTab('booking')}>Book a table</button> */}
        </div>

        <div className="gallery">
          <div className="gallery-main" style={{ backgroundImage: `url(${images[0]})` }} />
          <div className="gallery-side">
            {images.slice(1, 3).map((img, i) => {
              const isLast = i === 1;
              return (
                <div
                  key={i}
                  className="gallery-thumb"
                  style={{ backgroundImage: `url(${img})`, cursor: isLast ? 'pointer' : 'default' }}
                  onClick={isLast ? () => setActiveTab('photos') : undefined}
                >
                  {isLast && <div className="gallery-overlay">View Gallery</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="tabs">
          {['overview', 'menu', 'photos', 'reviews', 'booking'].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'tab active' : 'tab'}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'booking' ? 'Book a Table' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="tab-panel">
            <h2>About</h2>
            <p>{restaurant.description || 'No description added yet.'}</p>
            <div className="info-grid">
              <div><h3>Price for two</h3><p>{restaurant.priceRange || '—'}</p></div>
              <div><h3>Cuisine</h3><p>{cuisines.join(', ')}</p></div>
              <div><h3>Opening hours</h3><p>{restaurant.openingHours || '—'}</p></div>
              <div><h3>Contact</h3><p>{restaurant.contactNumber || '—'}</p></div>
            </div>
            <h2 style={{ marginTop: '32px' }}>Location</h2>
            <div className="map-embed">
              <iframe title="restaurant-location" width="100%" height="320" style={{ border: 0, borderRadius: '16px' }} loading="lazy" src={mapSrc} />
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="tab-panel">
            <h2>Menu</h2>
            {restaurant.menuItems?.length > 0 ? (
              <div className="menu-list">
                {restaurant.menuItems.map((item) => (
                  <div key={item.id} className="menu-item">
                    <span>{item.name}</span>
                    <span className="menu-price">{item.price}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="state-msg">Menu not added yet.</p>
            )}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="tab-panel">
            <h2>Photos</h2>
            <div className="photos-grid">
              {images.map((img, i) => (
                <div key={i} className="photo-tile" style={{ backgroundImage: `url(${img})` }} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="tab-panel">
            <h2>Reviews</h2>

            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h3>Leave a review</h3>
              <input
                placeholder="Your name"
                value={reviewForm.reviewerName}
                onChange={(e) => setReviewForm((p) => ({ ...p, reviewerName: e.target.value }))}
              />
              <div className="star-picker">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`star-btn ${n <= reviewForm.rating ? 'filled' : ''}`}
                    onClick={() => setReviewForm((p) => ({ ...p, rating: n }))}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Share your experience..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
              />
              {reviewError && <p className="field-error">{reviewError}</p>}
              <button type="submit" disabled={reviewSubmitting}>{reviewSubmitting ? 'Posting...' : 'Post review'}</button>
            </form>

            <div className="reviews-list">
              {restaurant.reviews?.length > 0 ? restaurant.reviews.map((r) => (
                <div key={r.id} className="review-card">
                  <div className="review-head">
                    <strong>{r.reviewerName}</strong>
                    <span className="review-stars">★ {r.rating}</span>
                  </div>
                  <p>{r.comment}</p>
                  <small>{new Date(r.createdAt).toLocaleDateString()}</small>
                </div>
              )) : <p className="state-msg">No reviews yet. Be the first to review.</p>}
            </div>
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="tab-panel">
            <h2>Book a Table</h2>
            <p className="state-msg">Table booking is coming soon.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
