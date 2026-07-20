'use client';
import { useEffect, useState } from 'react';

const slides = [
  { image: 'https://picsum.photos/id/292/1600/700', title: 'Discover great food near you', subtitle: 'Browse hundreds of restaurants, curated for every craving' },
  { image: 'https://picsum.photos/id/312/1600/700', title: 'From street food to fine dining', subtitle: 'Filter by cuisine, location, and budget in seconds' },
  { image: 'https://picsum.photos/id/365/1600/700', title: 'Find your next favorite spot', subtitle: 'Real details, real hours, no guesswork' },
];

export default function HeroSlider({ onSearch }) {
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(query);
    document.getElementById('listing')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section
      className="-mx-6 flex min-h-[480px] items-center justify-center overflow-hidden rounded-b-[32px] bg-cover bg-center"
      style={{ backgroundImage: `url(${slides[index].image})` }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center bg-white/15 px-5 py-[60px] text-center backdrop-blur-[6px]">
        <h1 className="m-0 mb-2.5 text-[2.8rem] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)] max-[480px]:text-3xl">{slides[index].title}</h1>
        <p className="m-0 mb-6 text-base text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">{slides[index].subtitle}</p>
        <form onSubmit={handleSubmit} className="flex w-full max-w-[520px] gap-2.5 rounded-[14px] bg-glass p-2 shadow-card-lg backdrop-blur-[14px]">
          <input
            type="text"
            placeholder="Search Restaurants By Name."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-[10px] border-none bg-white px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          />
          <button type="submit" className="cursor-pointer rounded-[10px] border-none bg-forest px-6 py-3.5 font-semibold text-white shadow-card-sm hover:bg-forest-dark">Search</button>
        </form>
        
      </div>
    </section>
  );
}
