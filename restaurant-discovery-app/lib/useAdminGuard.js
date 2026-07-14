'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminGuard() {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/check')
      .then((res) => {
        if (res.ok) setChecked(true);
        else router.push('/admin/login');
      });
  }, [router]);

  return checked;
}