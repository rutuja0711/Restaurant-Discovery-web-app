'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const linkClass = 'text-sm font-medium text-forest-dark hover:text-accent-gold';
const btnClass = 'cursor-pointer rounded-lg border border-black/10 bg-transparent px-4 py-2 text-[13px] font-medium text-forest-dark hover:bg-black/5';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isSuperadminArea = pathname?.startsWith('/superadmin') && pathname !== '/superadmin/login';
  const isAdminArea = pathname?.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/register';
  const isPrivilegedArea = isSuperadminArea || isAdminArea;

  useEffect(() => {
    if (isPrivilegedArea) {
      setAuthLoaded(true);
      return;
    }

    Promise.all([
      fetch('/api/auth/me').then((res) => res.json()),
      fetch('/api/admin/me').then((res) => res.json()),
      fetch('/api/superadmin/check').then((res) => res.ok),
    ]).then(([userData, adminData, superadminOk]) => {
      setUser(userData.user);
      setAdmin(adminData.admin);
      setIsSuperadmin(superadminOk);
      setAuthLoaded(true);
    });
  }, [pathname, isPrivilegedArea]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleSuperadminLogout() {
    await fetch('/api/superadmin/logout', { method: 'POST' });
    setIsSuperadmin(false);
    router.push('/superadmin/login');
  }

  async function handleAdminLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAdmin(null);
    router.push('/admin/login');
  }

  async function handleUserLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  }

  const authSection = isSuperadminArea ? (
    <button className={btnClass} onClick={handleSuperadminLogout}>Log out</button>
  ) : isAdminArea ? (
    <button className={btnClass} onClick={handleAdminLogout}>Log out</button>
  ) : !authLoaded ? null : user ? (
    <>
      <span className="text-sm font-medium text-forest-dark max-[700px]:w-full">Hi, {user.name}</span>
      <button className={btnClass} onClick={handleUserLogout}>Log out</button>
    </>
  ) : admin ? (
    <>
      <Link href="/admin" className={linkClass}>Dashboard</Link>
      <button className={btnClass} onClick={handleAdminLogout}>Log out</button>
    </>
  ) : isSuperadmin ? (
    <>
      <Link href="/superadmin" className={linkClass}>Dashboard</Link>
      <button className={btnClass} onClick={handleSuperadminLogout}>Log out</button>
    </>
  ) : (
    <>
      <Link href="/login" className={linkClass}>Log in</Link>
      <Link href="/register" className={linkClass}>Sign up</Link>
    </>
  );

  const navLinks = (
    <>
      <Link href="/" className={linkClass}>Home</Link>
      <Link href="/#explore" className={linkClass}>Explore Cuisines</Link>
      {user && !isPrivilegedArea && (
        <Link href="/my-bookings" className={linkClass}>My Bookings</Link>
      )}
    </>
  );

  return (
    <nav className="-mx-6 -mt-6 mb-0 bg-glass shadow-card-sm backdrop-blur-[14px]">
      <div className="flex items-center justify-between px-8 py-[18px] max-[700px]:px-5 max-[480px]:px-4 max-[480px]:py-3.5">
        <Link href="/" className="font-serif text-[1.4rem] font-bold text-forest max-[480px]:text-xl">
          🍽️ TableFinder
        </Link>

        <button
          className="hidden cursor-pointer flex-col justify-center gap-[5px] border-none bg-transparent p-2 max-[700px]:flex"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`h-0.5 w-[22px] rounded-sm bg-forest-dark transition-transform ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`h-0.5 w-[22px] rounded-sm bg-forest-dark transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-[22px] rounded-sm bg-forest-dark transition-transform ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>

        <div className="flex items-center gap-7 max-[700px]:hidden">
          {navLinks}
          {authSection}
        </div>
      </div>

      {menuOpen && (
        <div className="hidden border-t border-black/8 px-5 py-4 max-[700px]:flex max-[700px]:flex-col max-[700px]:gap-3.5">
          {navLinks}
          {authSection}
        </div>
      )}
    </nav>
  );
}
