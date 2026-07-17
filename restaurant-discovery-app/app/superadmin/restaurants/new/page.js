'use client';
import { useSuperadminGuard } from '@/lib/useSuperadminGuard';
import RestaurantForm from '@/components/RestaurantForm';
import Navbar from '@/components/Navbar';

export default function NewRestaurant() {
  const checked = useSuperadminGuard();
  if (!checked) return null;
  return (
    <>
      <Navbar />
      <main className="admin-page">
        <h1>Add Restaurant</h1>
        <RestaurantForm />
      </main>
    </>
  );
}
