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

  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setRestaurant(data))
      .catch(() => setError('Restaurant not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><p className="state-msg">Loading restaurant...</p></>;
  if (error) return <><Navbar /><p className="state-msg">{error}</p></>;

  const images = restaurant.images?.length > 0
    ? restaurant.images.map((img) => img.imageUrl)
    : [
        'https://picsum.photos/id/292/900/600',
        'https://picsum.photos/id/312/450/295',
        'https://picsum.photos/id/365/450/295',
      ];

  const mapQuery = encodeURIComponent(`${restaurant.address}, ${restaurant.location}`);

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
            <p className="details-subline">
              {restaurant.cuisine} · {restaurant.address}
            </p>
          </div>
          <div className="details-rating-badge">★ {restaurant.rating}</div>
        </div>

        <div className="gallery">
          <div className="gallery-main" style={{ backgroundImage: `url(${images[0]})` }} />
          <div className="gallery-side">
            {images.slice(1, 3).map((img, i) => (
              <div key={i} className="gallery-thumb" style={{ backgroundImage: `url(${img})` }} />
            ))}
          </div>
        </div>

        <div className="details-body">
          <div className="details-main">
            <div className="tabs">
              <button className={activeTab === 'overview' ? 'tab active' : 'tab'} onClick={() => setActiveTab('overview')}>Overview</button>
              <button className={activeTab === 'location' ? 'tab active' : 'tab'} onClick={() => setActiveTab('location')}>Location</button>
            </div>

            {activeTab === 'overview' && (
              <div className="tab-panel">
                <h2>About</h2>
                <p>{restaurant.description}</p>

                <div className="info-grid">
                  <div>
                    <h3>Price range</h3>
                    <p>{restaurant.priceRange}</p>
                  </div>
                  <div>
                    <h3>Cuisine</h3>
                    <p>{restaurant.cuisine}</p>
                  </div>
                  <div>
                    <h3>Opening hours</h3>
                    <p>{restaurant.openingHours}</p>
                  </div>
                  <div>
                    <h3>Contact</h3>
                    <p>{restaurant.contactNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div className="tab-panel">
                <h2>Location</h2>
                <p>{restaurant.address}, {restaurant.location}</p>
                <div className="map-embed">
                  <iframe
                    title="restaurant-location"
                    width="100%"
                    height="360"
                    style={{ border: 0, borderRadius: '16px' }}
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  />
                </div>
              </div>
            )}
          </div>
          

          <aside className="details-sidebar">
            <h3>Restaurant info</h3>
            <ul className="info-list">
              <li><strong>Address</strong><span>{restaurant.address}</span></li>
              <li><strong>Hours</strong><span>{restaurant.openingHours}</span></li>
              <li><strong>Contact</strong><span>{restaurant.contactNumber}</span></li>
              <li><strong>Price range</strong><span>{restaurant.priceRange}</span></li>
              <li><strong>Rating</strong><span>★ {restaurant.rating}</span></li>
            </ul>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}