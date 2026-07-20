'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const isSuperadminArea = pathname?.startsWith('/superadmin') && pathname !== '/superadmin/login';
  const isAdminArea = pathname?.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/register';
  const isPrivilegedArea = isSuperadminArea || isAdminArea;

  useEffect(() => {
    if (isPrivilegedArea) return;
    fetch('/api/auth/me').then((res) => res.json()).then((data) => setUser(data.user));
  }, [pathname, isPrivilegedArea]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleSuperadminLogout() {
    await fetch('/api/superadmin/logout', { method: 'POST' });
    router.push('/superadmin/login');
  }
  async function handleAdminLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }
  async function handleUserLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  }

  return (
    <nav className="-mx-6 -mt-6 mb-0 flex flex-wrap items-center justify-between bg-glass px-8 py-[18px] shadow-card-sm backdrop-blur-[14px] max-[700px]:relative max-[480px]:flex-col max-[480px]:gap-2.5 max-[480px]:p-3.5">
      <Link href="/" className="font-serif text-[1.4rem] font-bold text-forest">🍽️ TableFinder</Link>

      <button
        className="hidden cursor-pointer flex-col justify-center gap-[5px] border-none bg-transparent p-1.5 max-[700px]:flex"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span className="h-0.5 w-[22px] rounded-sm bg-forest-dark" />
        <span className="h-0.5 w-[22px] rounded-sm bg-forest-dark" />
        <span className="h-0.5 w-[22px] rounded-sm bg-forest-dark" />
      </button>

      <div className={`flex gap-7 max-[700px]:mt-3 max-[700px]:hidden max-[700px]:w-full max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-3.5 max-[700px]:border-t max-[700px]:border-black/8 max-[700px]:pt-4 max-[700px]:pb-1 ${menuOpen ? 'max-[700px]:flex' : ''}`}>
        <Link href="/" className="text-sm font-medium text-forest-dark hover:text-accent-gold">Home</Link>
        <Link href="/#explore" className="text-sm font-medium text-forest-dark hover:text-accent-gold">Explore Cuisines</Link>
        <Link href="/my-bookings" className="text-sm font-medium text-forest-dark hover:text-accent-gold">My Bookings</Link>

        {isSuperadminArea ? (
          <button className="cursor-pointer rounded-lg border border-black/10 bg-transparent px-4 py-2 text-[13px] font-medium text-forest-dark hover:bg-black/5" onClick={handleSuperadminLogout}>Log out</button>
        ) : isAdminArea ? (
          <button className="cursor-pointer rounded-lg border border-black/10 bg-transparent px-4 py-2 text-[13px] font-medium text-forest-dark hover:bg-black/5" onClick={handleAdminLogout}>Log out</button>
        ) : user ? (
          <>
            <span className="text-sm font-medium text-forest-dark">Hi, {user.name}</span>
            <button className="cursor-pointer rounded-lg border border-black/10 bg-transparent px-4 py-2 text-[13px] font-medium text-forest-dark hover:bg-black/5" onClick={handleUserLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium text-forest-dark hover:text-accent-gold">Log in</Link>
            <Link href="/register" className="text-sm font-medium text-forest-dark hover:text-accent-gold">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
