'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const isAdminArea = pathname?.startsWith('/superadmin') && pathname !== '/superadmin/login';

  useEffect(() => {
    if (isAdminArea) return;
    fetch('/api/auth/me').then((res) => res.json()).then((data) => setUser(data.user));
  }, [pathname, isAdminArea]);

  async function handleAdminLogout() {
    await fetch('/api/superadmin/logout', { method: 'POST' });
    router.push('/superadmin/login');
  }

  async function handleUserLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  }

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">🍽️ TableFinder</Link>
      <div className="navbar-links">
        <Link href="/">Home</Link>
        <Link href="/#explore">Explore Cuisines</Link>

        {isAdminArea ? (
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
            <Link href="/admin/login"></Link>
          </>
        )}
      </div>
    </nav>
  );
}
