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
    <nav className="navbar">
      <Link href="/" className="navbar-logo">🍽️ TableFinder</Link>

      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <Link href="/">Home</Link>
        <Link href="/#explore">Explore Cuisines</Link>
        <Link href="/my-bookings">My Bookings</Link>

        {isSuperadminArea ? (
          <button className="navbar-logout" onClick={handleSuperadminLogout}>Log out</button>
        ) : isAdminArea ? (
          <button className="navbar-logout" onClick={handleAdminLogout}>Log out</button>
        ) : user ? (
          <>
            <span className="navbar-user">Hi, {user.name}</span>
            <button className="navbar-logout" onClick={handleUserLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link href="/login">Log in</Link>
            <Link href="/register">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
