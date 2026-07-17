'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (res.ok) router.push('/admin');
    else { const data = await res.json(); setError(data.error || 'Something went wrong'); }
  }

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Admin Login</h1>
          <p className="wizard-hint">For restaurant owners managing their own listing.</p>
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={submitting}>{submitting ? 'Logging in...' : 'Log in'}</button>
          <p className="auth-switch">New restaurant owner? <a href="/admin/register">Register here</a></p>
        </form>
      </main>
    </>
  );
}
