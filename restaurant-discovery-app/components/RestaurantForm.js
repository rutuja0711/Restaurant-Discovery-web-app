"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "./ConfirmationModal";
import LocationPicker from "./LocationPicker";

const STEPS = [
  {
    key: "details",
    label: "Restaurant Details",
    desc: "Name, address and location",
  },
  {
    key: "type",
    label: "Cuisine & Timings",
    desc: "Cuisine type, price, opening hours",
  },
  { key: "images", label: "Images & Menu", desc: "Photos, menu items" },
];

const inputClass =
  "rounded-[10px] border-none bg-white px-4 py-3.5 text-sm font-sans shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-forest";

export default function RestaurantForm({
  initialData,
  restaurantId,
  apiBase = "/api/restaurants",
  redirectTo = "/superadmin",
}) {
  const isEdit = Boolean(restaurantId);
  const [stepIndex, setStepIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const menuItemsText = initialData?.menuItems
    ? initialData.menuItems.map((m) => `${m.name} - ${m.price}`).join("\n")
    : "";

  const [form, setForm] = useState({
    name: initialData?.name || "",
    cuisine: initialData?.cuisine || "",
    location: initialData?.location || "",
    address: initialData?.address || "",
    priceRange: initialData?.priceRange || "",
    rating: initialData?.rating || "",
    description: initialData?.description || "",
    openingHours: initialData?.openingHours || "",
    contactNumber: initialData?.contactNumber || "",
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
    menuItemsText,
  });

  const [existingImages, setExistingImages] = useState(
    initialData?.images?.map((i) => i.imageUrl) || [],
  );
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function geocodeInBrowser(address) {
    return new Promise((resolve) => {
      if (!window.google?.maps) return resolve(null);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const loc = results[0].geometry.location;
          resolve({ lat: loc.lat(), lng: loc.lng() });
        } else {
          resolve(null);
        }
      });
    });
  }

  async function handleAddressBlur() {
    if (form.address && form.location) {
      const coords = await geocodeInBrowser(
        `${form.address}, ${form.location}`,
      );
      if (coords) {
        setForm((prev) => ({
          ...prev,
          latitude: coords.lat,
          longitude: coords.lng,
        }));
      }
    }
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
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
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.location.trim()) e.location = "Location is required";
      if (!form.address.trim()) e.address = "Address is required";
    }
    if (index === 1) {
      if (!form.cuisine.trim()) e.cuisine = "Cuisine is required";
      if (form.rating && (form.rating < 0 || form.rating > 5))
        e.rating = "Rating must be 0-5";
    }
    return e;
  }

  function goNext() {
    const stepErrors = validateStep(stepIndex);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setErrors({});
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function parseMenuItems(text) {
    return text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, price] = line.split("-").map((s) => s.trim());
        return { name: name || line, price: price || "" };
      });
  }

  async function uploadNewFiles() {
    if (newFiles.length === 0) return [];
    setUploading(true);
    const fd = new FormData();
    newFiles.forEach((file) => fd.append("images", file));

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);

    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.urls;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const stepErrors = validateStep(stepIndex);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setSubmitting(true);

    try {
      const uploadedUrls = await uploadNewFiles();
      const allImageUrls = [...existingImages, ...uploadedUrls];

      const url = isEdit ? `${apiBase}/${restaurantId}` : apiBase;
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        name: form.name,
        cuisine: form.cuisine,
        location: form.location,
        address: form.address,
        priceRange: form.priceRange,
        rating: Number(form.rating) || 0,
        description: form.description,
        openingHours: form.openingHours,
        contactNumber: form.contactNumber,
        latitude: form.latitude,
        longitude: form.longitude,
        imageUrls: allImageUrls,
        menuItems: parseMenuItems(form.menuItemsText),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(true);
      } else {
        const data = await res.json();
        setErrors({ form: data.error || "Something went wrong" });
      }
    } catch {
      setErrors({ form: "Image upload failed. Please try again." });
    }
    setSubmitting(false);
  }

  return (
    <div className="mx-auto grid max-w-[900px] grid-cols-[280px_1fr] gap-7 max-[700px]:grid-cols-1">
      <aside className="h-fit rounded-[18px] bg-white p-5 shadow-card-sm">
        <p className="mb-3.5 text-[13px] text-text-muted">
          1. {isEdit ? "Edit" : "Create"} restaurant page
        </p>
        {STEPS.map((step, i) => (
          <button
            key={step.key}
            type="button"
            className={`flex w-full items-start gap-3 rounded-[10px] border-none px-2 py-3 text-left ${
              i === stepIndex
                ? "cursor-default bg-forest/6"
                : i < stepIndex
                  ? "cursor-pointer bg-transparent"
                  : "cursor-default bg-transparent"
            }`}
            onClick={() => i < stepIndex && setStepIndex(i)}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                i === stepIndex
                  ? "bg-forest text-white"
                  : i < stepIndex
                    ? "bg-success text-white"
                    : "bg-[#e5ddc9] text-text-muted"
              }`}
            >
              {i < stepIndex ? "✓" : i + 1}
            </span>
            <span>
              <strong className="block text-sm">{step.label}</strong>
              <small className="text-xs text-text-muted">{step.desc}</small>
            </span>
          </button>
        ))}
      </aside>

      <form
        className="flex max-w-none flex-col gap-3 rounded-[18px] bg-white p-7 shadow-card-md"
        onSubmit={handleSubmit}
      >
        {stepIndex === 0 && (
          <>
            <h2 className="m-0">Restaurant Details</h2>
            <p className="m-0 mb-1.5 text-[13px] text-text-muted">Name, address and location</p>

            <input
              className={inputClass}
              placeholder="Restaurant name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
            {errors.name && <p className="-mt-1.5 text-[13px] text-danger">{errors.name}</p>}

            <input
              className={inputClass}
              placeholder="Restaurant complete address"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              onBlur={handleAddressBlur}
            />
            {errors.address && <p className="-mt-1.5 text-[13px] text-danger">{errors.address}</p>}

            <input
              className={inputClass}
              placeholder="Location / city (e.g. Nashik)"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              onBlur={handleAddressBlur}
            />
            {errors.location && (
              <p className="-mt-1.5 text-[13px] text-danger">{errors.location}</p>
            )}

            <input
              className={inputClass}
              placeholder="Contact number"
              value={form.contactNumber}
              onChange={(e) => update("contactNumber", e.target.value)}
            />

            <label className="text-[13px] text-text-muted">
              Confirm the exact location on the map
            </label>
            <LocationPicker
              initialLat={form.latitude}
              initialLng={form.longitude}
              onChange={({ lat, lng }) =>
                setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }))
              }
            />
          </>
        )}

        {stepIndex === 1 && (
          <>
            <h2 className="m-0">Cuisine & Timings</h2>
            <p className="m-0 mb-1.5 text-[13px] text-text-muted">
              Establishment & cuisine type, opening hours
            </p>
            <input
              className={inputClass}
              placeholder="Cuisine (comma separated, e.g. North Indian, Chinese)"
              value={form.cuisine}
              onChange={(e) => update("cuisine", e.target.value)}
            />
            {errors.cuisine && <p className="-mt-1.5 text-[13px] text-danger">{errors.cuisine}</p>}
            <input
              className={inputClass}
              placeholder="Price for two (e.g. ₹2,000 for two)"
              value={form.priceRange}
              onChange={(e) => update("priceRange", e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Rating (0-5)"
              type="number"
              step="0.1"
              value={form.rating}
              onChange={(e) => update("rating", e.target.value)}
            />
            {errors.rating && <p className="-mt-1.5 text-[13px] text-danger">{errors.rating}</p>}
            <input
              className={inputClass}
              placeholder="Opening hours (e.g. 12 PM - 11 PM)"
              value={form.openingHours}
              onChange={(e) => update("openingHours", e.target.value)}
            />
            <textarea
              className={inputClass}
              placeholder="About / description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </>
        )}

        {stepIndex === 2 && (
          <>
            <h2 className="m-0">Images & Menu</h2>
            <p className="m-0 mb-1.5 text-[13px] text-text-muted">
              Upload restaurant photos (you can select multiple)
            </p>

            <label className="flex cursor-pointer items-center justify-center rounded-[14px] border-2 border-dashed border-black/15 p-7 text-sm text-text-muted transition hover:border-forest hover:bg-forest/[0.03]">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                hidden
              />
              <span>📷 Click to add photos</span>
            </label>

            {(existingImages.length > 0 || newPreviews.length > 0) && (
              <div className="mt-1.5 grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2.5">
                {existingImages.map((url, i) => (
                  <div
                    key={`existing-${i}`}
                    className="relative h-[90px] rounded-[10px] bg-cover bg-center shadow-card-sm"
                    style={{ backgroundImage: `url(${url})` }}
                  >
                    <button
                      type="button"
                      className="absolute top-1 right-1 flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full border-none bg-black/60 text-sm leading-none text-white"
                      onClick={() => removeExisting(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {newPreviews.map((url, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative h-[90px] rounded-[10px] bg-cover bg-center shadow-card-sm"
                    style={{ backgroundImage: `url(${url})` }}
                  >
                    <button
                      type="button"
                      className="absolute top-1 right-1 flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full border-none bg-black/60 text-sm leading-none text-white"
                      onClick={() => removeNew(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="text-[13px] text-text-muted">
              Menu items, one per line: Item name - Price
            </label>
            <textarea
              className={inputClass}
              placeholder={"Paneer Tikka - ₹220\nButter Naan - ₹60"}
              value={form.menuItemsText}
              onChange={(e) => update("menuItemsText", e.target.value)}
              rows={5}
            />
          </>
        )}

        {errors.form && <p className="-mt-1.5 text-[13px] text-danger">{errors.form}</p>}

        <div className="mt-3 flex justify-between">
          {stepIndex > 0 && (
            <button
              type="button"
              className="cursor-pointer rounded-[10px] border border-black/10 bg-forest text-white px-5 py-3"
              onClick={goBack}
            >
              Go back
            </button>
          )}
          {stepIndex < STEPS.length - 1 && (
            <button
              type="button"
              className="ml-auto cursor-pointer rounded-[10px] border-none bg-forest px-6 py-3 font-semibold text-white"
              onClick={goNext}
            >
              Next
            </button>
          )}
          {stepIndex === STEPS.length - 1 && (
            <button
              type="submit"
              className="ml-auto cursor-pointer rounded-[10px] border-none bg-forest px-6 py-3 font-semibold text-white disabled:opacity-70"
              disabled={submitting}
            >
              {uploading
                ? "Uploading images..."
                : submitting
                  ? "Saving..."
                  : isEdit
                    ? "Update restaurant"
                    : "Submit"}
            </button>
          )}
        </div>
      </form>

      <ConfirmationModal
        open={showModal}
        title={
          isEdit ? "Restaurant details updated" : "Restaurant listing submitted"
        }
        message="Your changes are live on the site now."
        onClose={() => router.push("/admin")}
        onSecondaryAction={() => router.push("/admin")}
        secondaryLabel="Go to dashboard"
      />
    </div>
  );
}
