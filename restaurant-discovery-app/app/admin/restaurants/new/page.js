'use client';
import { useAdminGuard } from '@/lib/useAdminGuard';
import RestaurantForm from '@/components/RestaurantForm';
import Navbar from '@/components/Navbar';

export default function NewRestaurant() {
  const checked = useAdminGuard();
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
