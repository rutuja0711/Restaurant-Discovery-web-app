'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

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
      <main className="auth-page">
        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Register as Admin</h1>
          <p className="wizard-hint">Create an account to manage your restaurant listing.</p>
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <input type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Register'}</button>
          <p className="auth-switch">Already have an account? <a href="/admin/login">Log in</a></p>
        </form>
      </main>
    </>
  );
}
