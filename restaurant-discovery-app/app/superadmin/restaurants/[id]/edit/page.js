'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSuperadminGuard } from '@/lib/useSuperadminGuard';
import RestaurantForm from '@/components/RestaurantForm';
import Navbar from '@/components/Navbar';

export default function EditRestaurant() {
  const checked = useSuperadminGuard();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!checked) return;
    fetch(`/api/restaurants/${id}`).then((res) => res.json()).then(setData);
  }, [checked, id]);

  if (!checked || !data) return null;

  return (
    <>
      <Navbar />
      <main className="py-6">
        <h1>Edit Restaurant</h1>
        <RestaurantForm initialData={data} restaurantId={id} />
      </main>
    </>
  );
}
