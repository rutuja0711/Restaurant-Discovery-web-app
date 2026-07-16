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
    <section className="hero" style={{ backgroundImage: `url(${slides[index].image})` }}>
      <div className="hero-overlay">
        <h1>{slides[index].title}</h1>
        <p>{slides[index].subtitle}</p>
        <form onSubmit={handleSubmit} className="hero-search">
          <input
            type="text"
            placeholder="Search Restaurants By Name."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={i === index ? 'dot active' : 'dot'}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}