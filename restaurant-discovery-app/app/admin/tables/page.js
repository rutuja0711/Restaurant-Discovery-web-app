'use client';
import { useEffect, useState } from 'react';
import { useAdminOwnerGuard } from '@/lib/useAdminOwnerGuard';
import { useAdminRestaurants } from '@/lib/useAdminRestaurants';
import AdminSidebar from '@/components/AdminSidebar';
import LazyLoader from '@/components/LazyLoader';

const inputClass =
  'w-full rounded-[10px] border-none bg-white px-4 py-3 text-sm shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-forest';

function TableCard({ table, onClick }) {
  const base = 'flex h-16 w-24 flex-col items-center justify-center rounded-xl text-xs font-semibold cursor-pointer transition shadow-card-sm';
  const style = !table.isActive
    ? 'bg-black/10 text-text-muted'
    : table.isVip
    ? 'bg-accent-gold text-forest-dark'
    : 'bg-forest text-white';
  return (
    <button type="button" onClick={onClick} className={`${base} ${style}`}>
      <span>{table.tableNumber}</span>
      <span className="text-[10px] font-normal opacity-80">{table.capacity} seats</span>
    </button>
  );
}

function TableModal({ initial, restaurantId, onClose, onSaved }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({
    tableNumber: initial?.tableNumber || '',
    capacity: initial?.capacity || '',
    isIndoor: initial?.isIndoor ?? true,
    isVip: initial?.isVip ?? false,
    isActive: initial?.isActive ?? true,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.tableNumber.trim() || !form.capacity) {
      setError('Table number and capacity are required.');
      return;
    }
    setSaving(true);
    const url = isEdit ? `/api/admin/tables/${initial.id}` : '/api/admin/tables';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, restaurantId, capacity: Number(form.capacity) }),
    });
    setSaving(false);
    if (res.ok) {
      onSaved();
    } else {
      const data = await res.json();
      setError(data.error || 'Something went wrong');
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this table?')) return;
    await fetch(`/api/admin/tables/${initial.id}`, { method: 'DELETE' });
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-forest-dark">
          {isEdit ? 'Edit table' : 'Add table'}
        </h3>

        <div className="flex flex-col gap-3">
          <input
            placeholder="Table number (e.g. T-01)"
            value={form.tableNumber}
            onChange={(e) => setForm((p) => ({ ...p, tableNumber: e.target.value }))}
            className={inputClass}
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Capacity (seats)"
            value={form.capacity}
            onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value.replace(/\D/g, '') }))}
            className={inputClass}
          />

          <label className="flex items-center justify-between text-sm text-forest-dark">
            Indoor table
            <input
              type="checkbox"
              checked={form.isIndoor}
              onChange={(e) => setForm((p) => ({ ...p, isIndoor: e.target.checked }))}
              className="h-4 w-4 accent-forest"
            />
          </label>
          <label className="flex items-center justify-between text-sm text-forest-dark">
            VIP table
            <input
              type="checkbox"
              checked={form.isVip}
              onChange={(e) => setForm((p) => ({ ...p, isVip: e.target.checked }))}
              className="h-4 w-4 accent-forest"
            />
          </label>
          <label className="flex items-center justify-between text-sm text-forest-dark">
            Active
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              className="h-4 w-4 accent-forest"
            />
          </label>
        </div>

        {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}

        <div className="mt-5 flex justify-between gap-2">
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="cursor-pointer rounded-lg border border-danger px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger/5"
            >
              Delete
            </button>
          )}
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-black/10 px-4 py-2.5 text-sm font-medium text-forest-dark"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="cursor-pointer rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminTables() {
  const checked = useAdminOwnerGuard();
  const { restaurants, selectedId, setSelectedId, loading: restaurantsLoading } = useAdminRestaurants();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalTable, setModalTable] = useState(null);
  const [showModal, setShowModal] = useState(false);

  function loadTables() {
    if (!selectedId) return;
    setLoading(true);
    fetch(`/api/admin/tables?restaurantId=${selectedId}`)
      .then((res) => res.json())
      .then(setTables)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (checked && selectedId) loadTables();
  }, [checked, selectedId]);

  function closeModal() {
    setShowModal(false);
    setModalTable(null);
  }

  function handleSaved() {
    closeModal();
    loadTables();
  }

  if (!checked) return null;

  const indoor = tables.filter((t) => t.isIndoor);
  const outdoor = tables.filter((t) => !t.isIndoor);

  return (
    <AdminSidebar restaurants={restaurants} selectedId={selectedId} onSelectRestaurant={setSelectedId}>
      {restaurantsLoading ? (
        <LazyLoader message="Loading..." />
      ) : restaurants.length === 0 ? (
        <p className="text-text-muted">Add a restaurant first to manage tables.</p>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="m-0">Table Management</h2>
            <button
              type="button"
              onClick={() => {
                setModalTable({});
                setShowModal(true);
              }}
              className="cursor-pointer rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white"
            >
              + Add table
            </button>
          </div>

          <div className="mb-4 flex flex-wrap gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-forest" /> Standard</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-accent-gold" /> VIP</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-black/10" /> Inactive</span>
          </div>

          {loading ? (
            <LazyLoader message="Loading tables..." />
          ) : tables.length === 0 ? (
            <p className="text-text-muted">No tables added yet.</p>
          ) : (
            <>
              {indoor.length > 0 && (
                <div className="mb-6">
                  <p className="mb-3 text-sm font-semibold text-forest-dark">Indoor</p>
                  <div className="flex flex-wrap gap-3">
                    {indoor.map((t) => (
                      <TableCard key={t.id} table={t} onClick={() => { setModalTable(t); setShowModal(true); }} />
                    ))}
                  </div>
                </div>
              )}
              {outdoor.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-semibold text-forest-dark">Outdoor</p>
                  <div className="flex flex-wrap gap-3">
                    {outdoor.map((t) => (
                      <TableCard key={t.id} table={t} onClick={() => { setModalTable(t); setShowModal(true); }} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {showModal && (
        <TableModal initial={modalTable} restaurantId={selectedId} onClose={closeModal} onSaved={handleSaved} />
      )}
    </AdminSidebar>
  );
}
