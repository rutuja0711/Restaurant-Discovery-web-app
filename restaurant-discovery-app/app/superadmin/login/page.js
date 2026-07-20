'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const formClass = 'flex max-w-[460px] flex-col gap-3.5 rounded-[20px] bg-glass p-7 shadow-card-md backdrop-blur-[14px]';
const inputClass = 'rounded-[10px] border-none bg-white px-4 py-3.5 text-sm shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-forest';
const buttonClass = 'cursor-pointer rounded-[10px] border-none bg-forest px-4 py-3.5 text-sm font-semibold text-white shadow-card-sm hover:bg-forest-dark';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/superadmin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push('/superadmin');
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <main className="flex justify-center px-5 py-[60px]">
      <form onSubmit={handleSubmit} className={formClass}>
        <h1 className="mt-0">Superadmin Login</h1>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        {error && <p className="-mt-1.5 text-[13px] text-danger">{error}</p>}
        <button type="submit" className={buttonClass}>Log in</button>
      </form>
    </main>
  );
}
