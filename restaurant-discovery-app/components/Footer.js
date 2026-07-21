import Link from "next/link";

export default function Footer() {
  return (
    <footer className="-mx-6 -mb-6 mt-12 rounded-t-[32px] bg-forest-dark px-7 py-14 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-10">
        <div className="flex flex-col gap-3">
          <p className="font-serif text-xl font-bold">🍽️ TableFinder</p>
          <p className="max-w-[220px] text-sm text-white/60">
            Discover great food near you, from street eats to fine dining.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">About</p>
          <Link href="/" className="text-sm text-white/70 hover:text-gold">Who we are</Link>
          <Link href="/#explore" className="text-sm text-white/70 hover:text-gold">Explore cuisines</Link>
          <Link href="/my-bookings" className="text-sm text-white/70 hover:text-gold">My bookings</Link>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">For Restaurants</p>
          <Link href="/admin/login" className="text-sm text-white/70 hover:text-gold">Partner with us</Link>
          <Link href="/admin/register" className="text-sm text-white/70 hover:text-gold">List your restaurant</Link>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Learn More</p>
          <Link href="/login" className="text-sm text-white/70 hover:text-gold">Log in</Link>
          <Link href="/register" className="text-sm text-white/70 hover:text-gold">Sign up</Link>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Social Links</p>
          <div className="flex gap-3">
            {['in', 'ig', 'x', 'yt'].map((s) => (
              <span
                key={s}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[11px] uppercase text-white/80"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} TableFinder. A student project restaurant discovery app.
      </div>
    </footer>
  );
}
