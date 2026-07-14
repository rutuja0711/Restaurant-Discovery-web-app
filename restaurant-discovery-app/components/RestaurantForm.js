'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RestaurantForm({ initialData, restaurantId }) {
  const isEdit = Boolean(restaurantId);
  const [form, setForm] = useState(initialData || {
    name: '', cuisine: '', location: '', address: '',
    priceRange: '', rating: '', description: '', openingHours: '', contactNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.cuisine.trim()) e.cuisine = 'Cuisine is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (form.rating && (form.rating < 0 || form.rating > 5)) e.rating = 'Rating must be 0-5';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    const url = isEdit ? `/api/restaurants/${restaurantId}` : '/api/restaurants';
    const method = isEdit ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, rating: Number(form.rating) || 0 }),
    });
    router.push('/admin');
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={form.name} onChange={(e) => update('name', e.target.value)} />
      {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}

      <input placeholder="Cuisine" value={form.cuisine} onChange={(e) => update('cuisine', e.target.value)} />
      {errors.cuisine && <p style={{ color: 'red' }}>{errors.cuisine}</p>}

      <input placeholder="Location" value={form.location} onChange={(e) => update('location', e.target.value)} />
      {errors.location && <p style={{ color: 'red' }}>{errors.location}</p>}

      <input placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)} />
      <input placeholder="Price range" value={form.priceRange} onChange={(e) => update('priceRange', e.target.value)} />
      <input placeholder="Rating (0-5)" type="number" step="0.1" value={form.rating} onChange={(e) => update('rating', e.target.value)} />
      {errors.rating && <p style={{ color: 'red' }}>{errors.rating}</p>}

      <textarea placeholder="Description" value={form.description} onChange={(e) => update('description', e.target.value)} />
      <input placeholder="Opening hours" value={form.openingHours} onChange={(e) => update('openingHours', e.target.value)} />
      <input placeholder="Contact number" value={form.contactNumber} onChange={(e) => update('contactNumber', e.target.value)} />

      <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : isEdit ? 'Update' : 'Add'} Restaurant</button>
    </form>
  );
}