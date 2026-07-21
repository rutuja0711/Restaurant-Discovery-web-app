'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LazyLoader from '@/components/LazyLoader';

const cardClass =
  'mx-auto flex w-full max-w-[480px] flex-col gap-4 rounded-[20px] bg-white p-8 shadow-card-md';
const buttonClass =
  'cursor-pointer rounded-[10px] border-none bg-forest px-4 py-3 text-sm font-semibold text-white shadow-card-sm hover:bg-forest-dark';
const secondaryButtonClass =
  'cursor-pointer rounded-[10px] border border-black/10 bg-transparent px-4 py-3 text-sm font-medium text-forest-dark hover:bg-black/5';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.replace('/login');
        } else {
          setUser(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <LazyLoader fullPage message="Loading profile..." />
      </>
    );
  }

  if (!user) return null;

  const initial = user.name?.trim()?.charAt(0)?.toUpperCase();

  return (
    <>
      <Navbar />
      <main className="flex justify-center bg-[#f4f4f4] px-5 py-[60px]">
        <div className={cardClass}>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forest text-xl font-semibold text-white">
              {initial || (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </span>
            <div className="min-w-0">
              <h1 className="m-0 truncate text-xl font-semibold">{user.name}</h1>
              <p className="m-0 truncate text-sm text-text-muted">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-black/8 pt-4">
            <a href="/my-bookings" className={secondaryButtonClass}>
              My Bookings
            </a>
            <button onClick={handleLogout} className={buttonClass}>
              Log out
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}