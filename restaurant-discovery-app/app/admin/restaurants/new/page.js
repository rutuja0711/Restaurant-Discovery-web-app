'use client';
import { useAdminGuard } from '@/lib/useAdminGuard';
import RestaurantForm from '@/components/RestaurantForm';

export default function NewRestaurant() {
  const checked = useAdminGuard();
  if (!checked) return null;
  return (
    <main>
      <h1>Add Restaurant</h1>
      <RestaurantForm />
    </main>
  );
}