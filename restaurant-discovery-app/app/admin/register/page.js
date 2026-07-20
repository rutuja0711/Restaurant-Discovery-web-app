'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const formClass = 'flex w-full max-w-[400px] flex-col gap-3.5 rounded-[20px] bg-glass p-7 shadow-card-md backdrop-blur-[14px]';
const inputClass = 'rounded-[10px] border-none bg-white px-4 py-3.5 text-sm shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-forest';
const buttonClass = 'cursor-pointer rounded-[10px] border-none bg-forest px-4 py-3.5 text-sm font-semibold text-white shadow-card-sm hover:bg-forest-dark disabled:opacity-70';

export default function AdminRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await fetch('/api/admin/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (res.ok) router.push('/admin');
    else { const data = await res.json(); setError(data.error || 'Something went wrong'); }
  }

  return (
    <>
      <Navbar />
      <main className="flex justify-center px-5 py-[60px]">
        <form onSubmit={handleSubmit} className={formClass}>
          <h1 className="mt-0">Register as Admin</h1>
          <p className="m-0 mb-1.5 text-[13px] text-text-muted">Create an account to manage your restaurant listing.</p>
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className={inputClass} />
          <input type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className={inputClass} />
          {error && <p className="-mt-1.5 text-[13px] text-danger">{error}</p>}
          <button type="submit" disabled={submitting} className={buttonClass}>{submitting ? 'Creating account...' : 'Register'}</button>
          <p className="mt-1 text-center text-[13px] text-text-muted">Already have an account? <a href="/admin/login" className="font-medium text-forest">Log in</a></p>
        </form>
      </main>
    </>
  );
}
