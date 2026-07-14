'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminGuard() {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.push('/admin/login');
    } else {
      setChecked(true);
    }
  }, [router]);

  return checked;
}