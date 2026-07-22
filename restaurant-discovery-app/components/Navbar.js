'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const linkClass = 'text-sm font-medium text-forest-dark hover:text-accent-gold';
const btnClass = 'cursor-pointer rounded-lg border border-black/10 bg-transparent px-4 py-2 text-[13px] font-medium text-forest-dark hover:bg-black/5';

function IconLogOut({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconUserFallback({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconChevronsUpDown({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="7 15 12 20 17 15" />
      <polyline points="7 9 12 4 17 9" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

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
    setProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!profileMenuOpen) return;

    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setProfileMenuOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileMenuOpen]);

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
    setProfileMenuOpen(false);
    router.push('/');
  }

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase();

  const authSection = isSuperadminArea ? (
    <button className={btnClass} onClick={handleSuperadminLogout}>Log out</button>
  ) : isAdminArea ? (
    <button className={btnClass} onClick={handleAdminLogout}>Log out</button>
  ) : !authLoaded ? null : user ? (
    <div className="relative" ref={profileRef}>
      <button
        type="button"
        onClick={() => setProfileMenuOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={profileMenuOpen}
        className="flex cursor-pointer items-center gap-1.5 rounded-full border border-black/10 bg-white p-1 hover:bg-black/5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white">
          {initial || <IconUserFallback size={16} />}
        </span>
        <IconChevronsUpDown size={14} className="mr-1 text-forest-dark/50" />
      </button>

      {profileMenuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-[100] w-[280px] rounded-2xl border border-black/5 bg-white p-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-base font-semibold text-white">
              {initial || <IconUserFallback size={18} />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-forest-dark">{user.name}</p>
              <p className="truncate text-[13px] text-forest-dark/60">{user.email}</p>
            </div>
          </div>

          <div className="my-3 border-t border-black/8" />

          <button
            type="button"
            onClick={handleUserLogout}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-[14px] font-medium text-red-600 hover:bg-red-100"
          >
            <IconLogOut size={18} />
            Log out
          </button>
        </div>
      )}
    </div>
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
    <nav className="relative z-50 -mx-6 -mt-6 mb-0 bg-glass shadow-card-sm backdrop-blur-[14px]">
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
