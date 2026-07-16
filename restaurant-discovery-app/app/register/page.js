'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSubmitting(false);

    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.error || 'Something went wrong');
    }
  }

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Create an account</h1>
          <input placeholder="Full name" value={form.name} onChange={(e) => update('name', e.target.value)} />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          <input type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => update('password', e.target.value)} />
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Sign up'}</button>
          <p className="auth-switch">Already have an account? <a href="/login">Log in</a></p>
        </form>
      </main>
    </>
  );
}
