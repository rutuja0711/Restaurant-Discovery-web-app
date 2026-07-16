'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
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
    const res = await fetch('/api/auth/login', {
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
          <h1>Log in</h1>
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => update('password', e.target.value)} />
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={submitting}>{submitting ? 'Logging in...' : 'Log in'}</button>
          <p className="auth-switch">Don't have an account? <a href="/register">Sign up</a></p>
        </form>
      </main>
    </>
  );
}
