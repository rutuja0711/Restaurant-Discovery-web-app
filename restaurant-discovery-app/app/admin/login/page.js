'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin');
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <main>
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Log in</button>
      </form>
    </main>
  );
}