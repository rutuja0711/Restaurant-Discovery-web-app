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

  if (loading) return <><Navbar /><p className="px-6 py-[60px] text-center text-[15px] text-text-muted">Loading restaurant...</p></>;
  if (error) return <><Navbar /><p className="px-6 py-[60px] text-center text-[15px] text-text-muted">{error}</p></>;

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
      <main className="mx-auto max-w-[1100px] px-0 py-6">
        <p className="mb-4 text-[13px] text-text-muted">
          <a href="/" className="text-text-muted hover:text-forest">Home</a> / <a href={`/?location=${restaurant.location}`} className="text-text-muted hover:text-forest">{restaurant.location}</a> / {restaurant.name}
        </p>

        <div className="mb-5 flex items-start justify-between max-[700px]:flex-col max-[700px]:gap-3">
          <div>
            <h1>{restaurant.name}</h1>
            <p className="mt-1 text-sm text-text-muted">
              {restaurant.cuisine} · {restaurant.address}
            </p>
          </div>
          <div className="rounded-xl bg-forest px-[18px] py-2.5 font-semibold text-white shadow-card-sm">
            ★ {restaurant.rating}
          </div>
        </div>

        <div className="mb-7 grid h-[340px] grid-cols-[2fr_1fr] gap-3 overflow-hidden rounded-[20px] shadow-card-md max-[700px]:h-auto max-[700px]:grid-cols-1">
          <div className="bg-cover bg-center" style={{ backgroundImage: `url(${images[0]})` }} />
          <div className="grid grid-rows-2 gap-3 max-[700px]:grid-cols-2 max-[700px]:grid-rows-[140px]">
            {images.slice(1, 3).map((img, i) => (
              <div key={i} className="bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[2fr_1fr] items-start gap-8 max-[700px]:grid-cols-1">
          <div>
            <div className="mb-6 flex gap-2 border-b border-black/8">
              <button
                className={`cursor-pointer border-none bg-transparent px-[18px] py-3 text-sm font-medium ${
                  activeTab === 'overview' ? 'border-b-2 border-forest text-forest' : 'border-b-2 border-transparent text-text-muted'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`cursor-pointer border-none bg-transparent px-[18px] py-3 text-sm font-medium ${
                  activeTab === 'location' ? 'border-b-2 border-forest text-forest' : 'border-b-2 border-transparent text-text-muted'
                }`}
                onClick={() => setActiveTab('location')}
              >
                Location
              </button>
            </div>

            {activeTab === 'overview' && (
              <div>
                <h2 className="mt-0">About</h2>
                <p>{restaurant.description}</p>

                <div className="mt-6 grid grid-cols-2 gap-5">
                  <div>
                    <h3 className="m-0 mb-1 font-sans text-[13px] tracking-wide text-text-muted uppercase">Price range</h3>
                    <p className="m-0 text-[15px]">{restaurant.priceRange}</p>
                  </div>
                  <div>
                    <h3 className="m-0 mb-1 font-sans text-[13px] tracking-wide text-text-muted uppercase">Cuisine</h3>
                    <p className="m-0 text-[15px]">{restaurant.cuisine}</p>
                  </div>
                  <div>
                    <h3 className="m-0 mb-1 font-sans text-[13px] tracking-wide text-text-muted uppercase">Opening hours</h3>
                    <p className="m-0 text-[15px]">{restaurant.openingHours}</p>
                  </div>
                  <div>
                    <h3 className="m-0 mb-1 font-sans text-[13px] tracking-wide text-text-muted uppercase">Contact</h3>
                    <p className="m-0 text-[15px]">{restaurant.contactNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div>
                <h2 className="mt-0">Location</h2>
                <p>{restaurant.address}, {restaurant.location}</p>
                <div className="mt-4 overflow-hidden rounded-2xl shadow-card-md">
                  <iframe
                    title="restaurant-location"
                    width="100%"
                    height="360"
                    className="rounded-2xl border-0"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  />
                </div>
              </div>
            )}
          </div>

          <aside className="sticky top-6 rounded-[20px] bg-white p-6 shadow-card-md">
            <h3 className="mt-0">Restaurant info</h3>
            <ul className="m-0 mt-4 flex list-none flex-col gap-3.5 p-0">
              <li className="flex flex-col gap-0.5 border-b border-black/5 pb-3 text-sm">
                <strong className="text-xs tracking-wide text-text-muted uppercase">Address</strong>
                <span>{restaurant.address}</span>
              </li>
              <li className="flex flex-col gap-0.5 border-b border-black/5 pb-3 text-sm">
                <strong className="text-xs tracking-wide text-text-muted uppercase">Hours</strong>
                <span>{restaurant.openingHours}</span>
              </li>
              <li className="flex flex-col gap-0.5 border-b border-black/5 pb-3 text-sm">
                <strong className="text-xs tracking-wide text-text-muted uppercase">Contact</strong>
                <span>{restaurant.contactNumber}</span>
              </li>
              <li className="flex flex-col gap-0.5 border-b border-black/5 pb-3 text-sm">
                <strong className="text-xs tracking-wide text-text-muted uppercase">Price range</strong>
                <span>{restaurant.priceRange}</span>
              </li>
              <li className="flex flex-col gap-0.5 border-b border-black/5 pb-3 text-sm">
                <strong className="text-xs tracking-wide text-text-muted uppercase">Rating</strong>
                <span>★ {restaurant.rating}</span>
              </li>
            </ul>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
