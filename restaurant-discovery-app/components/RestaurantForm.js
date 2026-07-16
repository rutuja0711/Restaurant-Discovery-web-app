'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmationModal from './ConfirmationModal';

const STEPS = [
  { key: 'details', label: 'Restaurant Details', desc: 'Name, address and location' },
  { key: 'type', label: 'Cuisine & Timings', desc: 'Cuisine type, price, opening hours' },
  { key: 'images', label: 'Images & Menu', desc: 'Photos, menu items' },
];

export default function RestaurantForm({ initialData, restaurantId }) {
  const isEdit = Boolean(restaurantId);
  const [stepIndex, setStepIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const menuItemsText = initialData?.menuItems
    ? initialData.menuItems.map((m) => `${m.name} - ${m.price}`).join('\n')
    : '';

  const [form, setForm] = useState({
    name: initialData?.name || '',
    cuisine: initialData?.cuisine || '',
    location: initialData?.location || '',
    address: initialData?.address || '',
    priceRange: initialData?.priceRange || '',
    rating: initialData?.rating || '',
    description: initialData?.description || '',
    openingHours: initialData?.openingHours || '',
    contactNumber: initialData?.contactNumber || '',
    menuItemsText,
  });

  const [existingImages, setExistingImages] = useState(initialData?.images?.map((i) => i.imageUrl) || []);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  }

  function removeExisting(index) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNew(index) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function validateStep(index) {
    const e = {};
    if (index === 0) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.location.trim()) e.location = 'Location is required';
      if (!form.address.trim()) e.address = 'Address is required';
    }
    if (index === 1) {
      if (!form.cuisine.trim()) e.cuisine = 'Cuisine is required';
      if (form.rating && (form.rating < 0 || form.rating > 5)) e.rating = 'Rating must be 0-5';
    }
    return e;
  }

  function goNext() {
    const stepErrors = validateStep(stepIndex);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setErrors({});
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setErrors({});
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function parseMenuItems(text) {
    return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
      const [name, price] = line.split('-').map((s) => s.trim());
      return { name: name || line, price: price || '' };
    });
  }

  async function uploadNewFiles() {
    if (newFiles.length === 0) return [];
    setUploading(true);
    const fd = new FormData();
    newFiles.forEach((file) => fd.append('images', file));

    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    setUploading(false);

    if (!res.ok) throw new Error('Image upload failed');
    const data = await res.json();
    return data.urls;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const stepErrors = validateStep(stepIndex);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setSubmitting(true);

    try {
      const uploadedUrls = await uploadNewFiles();
      const allImageUrls = [...existingImages, ...uploadedUrls];

      const url = isEdit ? `/api/restaurants/${restaurantId}` : '/api/restaurants';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        name: form.name, cuisine: form.cuisine, location: form.location, address: form.address,
        priceRange: form.priceRange, rating: Number(form.rating) || 0, description: form.description,
        openingHours: form.openingHours, contactNumber: form.contactNumber,
        imageUrls: allImageUrls, menuItems: parseMenuItems(form.menuItemsText),
      };

      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(true);
      } else {
        const data = await res.json();
        setErrors({ form: data.error || 'Something went wrong' });
      }
    } catch (err) {
      setErrors({ form: 'Image upload failed. Please try again.' });
    }
    setSubmitting(false);
  }

  return (
    <div className="wizard">
      <aside className="wizard-sidebar">
        <p className="wizard-sidebar-title">1. {isEdit ? 'Edit' : 'Create'} restaurant page</p>
        {STEPS.map((step, i) => (
          <button key={step.key} type="button"
            className={`wizard-step-nav ${i === stepIndex ? 'active' : ''} ${i < stepIndex ? 'done' : ''}`}
            onClick={() => i < stepIndex && setStepIndex(i)}>
            <span className="wizard-step-num">{i < stepIndex ? '✓' : i + 1}</span>
            <span><strong>{step.label}</strong><small>{step.desc}</small></span>
          </button>
        ))}
      </aside>

      <form className="wizard-panel" onSubmit={handleSubmit}>
        {stepIndex === 0 && (
          <>
            <h2>Restaurant Details</h2>
            <p className="wizard-hint">Name, address and location</p>
            <input placeholder="Restaurant name" value={form.name} onChange={(e) => update('name', e.target.value)} />
            {errors.name && <p className="field-error">{errors.name}</p>}
            <input placeholder="Restaurant complete address" value={form.address} onChange={(e) => update('address', e.target.value)} />
            {errors.address && <p className="field-error">{errors.address}</p>}
            <input placeholder="Location / city (e.g. Nashik)" value={form.location} onChange={(e) => update('location', e.target.value)} />
            {errors.location && <p className="field-error">{errors.location}</p>}
            <input placeholder="Contact number" value={form.contactNumber} onChange={(e) => update('contactNumber', e.target.value)} />
          </>
        )}
        <div style={{ display: 'flex', gap: '10px' }}>
  <input placeholder="Latitude (e.g. 20.0059)" value={form.latitude} onChange={(e) => update('latitude', e.target.value)} />
  <input placeholder="Longitude (e.g. 73.7910)" value={form.longitude} onChange={(e) => update('longitude', e.target.value)} />
</div>
<p className="wizard-hint">Tip: right-click the spot on Google Maps, the coordinates copy to your clipboard.</p>

        {stepIndex === 1 && (
          <>
            <h2>Cuisine & Timings</h2>
            <p className="wizard-hint">Establishment & cuisine type, opening hours</p>
            <input placeholder="Cuisine (comma separated, e.g. North Indian, Chinese)" value={form.cuisine} onChange={(e) => update('cuisine', e.target.value)} />
            {errors.cuisine && <p className="field-error">{errors.cuisine}</p>}
            <input placeholder="Price for two (e.g. ₹2,000 for two)" value={form.priceRange} onChange={(e) => update('priceRange', e.target.value)} />
            <input placeholder="Rating (0-5)" type="number" step="0.1" value={form.rating} onChange={(e) => update('rating', e.target.value)} />
            {errors.rating && <p className="field-error">{errors.rating}</p>}
            <input placeholder="Opening hours (e.g. 12 PM - 11 PM)" value={form.openingHours} onChange={(e) => update('openingHours', e.target.value)} />
            <textarea placeholder="About / description" value={form.description} onChange={(e) => update('description', e.target.value)} />
          </>
        )}

        {stepIndex === 2 && (
          <>
            <h2>Images & Menu</h2>
            <p className="wizard-hint">Upload restaurant photos (you can select multiple)</p>

            <label className="upload-dropzone">
              <input type="file" accept="image/*" multiple onChange={handleFileSelect} hidden />
              <span>📷 Click to add photos</span>
            </label>

            {(existingImages.length > 0 || newPreviews.length > 0) && (
              <div className="image-thumb-grid">
                {existingImages.map((url, i) => ( 
                  <div key={`existing-${i}`} className="image-thumb" style={{ backgroundImage: `url(${url})` }}>
                    <button type="button" className="image-thumb-remove" onClick={() => removeExisting(i)}>×</button>
                  </div>
                ))}
                {newPreviews.map((url, i) => (
                  <div key={`new-${i}`} className="image-thumb" style={{ backgroundImage: `url(${url})` }}>
                    <button type="button" className="image-thumb-remove" onClick={() => removeNew(i)}>×</button>
                  </div>
                ))}
              </div>
            )}

            <label className="wizard-hint">Menu items, one per line: Item name - Price</label>
            <textarea
              placeholder={'Paneer Tikka - ₹220\nButter Naan - ₹60'}
              value={form.menuItemsText}
              onChange={(e) => update('menuItemsText', e.target.value)}
              rows={5}
            />
          </>
        )}

        {errors.form && <p className="field-error">{errors.form}</p>}

        <div className="wizard-actions">
          {stepIndex > 0 && <button type="button" className="wizard-btn-back" onClick={goBack}>Go back</button>}
          {stepIndex < STEPS.length - 1 && (
            <button type="button" className="wizard-btn-next" onClick={goNext}>Next</button>
          )}
          {stepIndex === STEPS.length - 1 && (
            <button type="submit" className="wizard-btn-next" disabled={submitting}>
              {uploading ? 'Uploading images...' : submitting ? 'Saving...' : isEdit ? 'Update restaurant' : 'Submit'}
            </button>
          )}
        </div>
      </form>

      <ConfirmationModal
        open={showModal}
        title={isEdit ? 'Restaurant details updated' : 'Restaurant listing submitted'}
        message="Your changes are live on the site now."
        onClose={() => router.push('/admin')}
        onSecondaryAction={() => router.push('/admin')}
        secondaryLabel="Go to dashboard"
      />
    </div>
  );
}
