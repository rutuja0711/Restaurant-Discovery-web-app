'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAdminGuard } from '@/lib/useAdminGuard';
import RestaurantForm from '@/components/RestaurantForm';

export default function EditRestaurant() {
  const checked = useAdminGuard();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!checked) return;
    fetch(`/api/restaurants/${id}`).then((res) => res.json()).then(setData);
  }, [checked, id]);

  if (!checked || !data) return null;

  return (
    <main>
      <h1>Edit Restaurant</h1>
      <RestaurantForm initialData={data} restaurantId={id} />
    </main>
  );
}