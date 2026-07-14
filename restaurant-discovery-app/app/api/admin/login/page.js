async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  
    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Invalid credentials');
    }
  }