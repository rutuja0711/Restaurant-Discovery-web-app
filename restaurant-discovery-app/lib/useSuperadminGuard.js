'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useSuperadminGuard() {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/superadmin/check')
      .then((res) => {
        if (res.ok) setChecked(true);
        else router.push('/superadmin/login');
      });
  }, [router]);

  return checked;
}