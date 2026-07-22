'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'grid' },
  { href: '/admin/tables', label: 'Tables', icon: 'table' },
  { href: '/admin/bookings', label: 'Bookings', icon: 'calendar' },
  { href: '/admin', label: 'My Restaurants', icon: 'store' },
];

function Icon({ name }) {
  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </>
    ),
    table: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="9" y1="10" x2="9" y2="20" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <line x1="16" y1="3" x2="16" y2="7" />
        <line x1="8" y1="3" x2="8" y2="7" />
        <line x1="3" y1="11" x2="21" y2="11" />
      </>
    ),
    store: (
      <>
        <path d="M3 9l1-5h16l1 5" />
        <path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
        <line x1="9" y1="21" x2="9" y2="14" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

export default function AdminSidebar({ children, restaurants, selectedId, onSelectRestaurant }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="flex w-[220px] shrink-0 flex-col justify-between bg-forest-dark px-4 py-6 text-white max-[900px]:hidden">
        <div>
          <p className="mb-8 px-2 font-serif text-lg font-bold">🍽️ TableFinder</p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon name={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Icon name="logout" />
          Logout
        </button>
      </aside>

      <div className="flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 bg-white px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Restaurant Dashboard</p>
            {restaurants && restaurants.length > 0 ? (
              <select
                value={selectedId || ''}
                onChange={(e) => onSelectRestaurant?.(Number(e.target.value))}
                className="mt-1 rounded-lg border-none bg-transparent text-lg font-semibold text-forest-dark focus:outline-none"
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            ) : (
              <p className="mt-1 text-lg font-semibold text-forest-dark">No restaurant yet</p>
            )}
          </div>
          <p className="text-sm text-text-muted">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <div className="flex gap-1 overflow-x-auto border-b border-black/8 bg-white px-3 py-2 min-[901px]:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${
                pathname === item.href ? 'bg-forest text-white' : 'bg-black/5 text-forest-dark'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-lg bg-black/5 px-3 py-2 text-xs font-medium text-forest-dark"
          >
            Logout
          </button>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
