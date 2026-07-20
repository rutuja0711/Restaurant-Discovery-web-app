import Link from "next/link";

export default function Footer() {
  return (
    <footer className="-mx-6 -mb-6 mt-12 rounded-t-[32px] bg-forest-dark px-7 py-10 text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <p className="font-serif text-lg font-bold">🍽️ TableFinder</p>
        <p className="max-w-sm text-sm text-white/60">
          Discover great food near you, from street eats to fine dining.
        </p>

        <div className="flex gap-6 text-sm text-white/70">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <Link href="/#explore" className="hover:text-gold">
            Explore Cuisines
          </Link>
          <Link href="/my-bookings" className="hover:text-gold">
            My Bookings
          </Link>
          {/* <Link href="/admin/login" className="hover:text-gold">Restaurant Owner</Link> */}
        </div>

        <div className="mt-4 w-full border-t border-white/10 pt-4 text-xs text-white/50">
          © {new Date().getFullYear()} TableFinder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
