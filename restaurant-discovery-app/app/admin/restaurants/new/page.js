'use client';
import { useAdminOwnerGuard } from '@/lib/useAdminOwnerGuard';
import RestaurantForm from '@/components/RestaurantForm';
import Navbar from '@/components/Navbar';

export default function NewRestaurant() {
  const checked = useAdminOwnerGuard();
  if (!checked) return null;
  return (
    <>
      <Navbar />
      <main className="admin-page">
        <h1>Add Restaurant</h1>
        <RestaurantForm apiBase="/api/admin/restaurants" redirectTo="/admin" />
      </main>
    </>
  );
}
