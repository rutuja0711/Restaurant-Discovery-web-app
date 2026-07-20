'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useUserGuard(loginPath = '/login') {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setChecked(true);
        } else {
          router.push(loginPath);
        }
      });
  }, [router, loginPath]);

  return { user, checked };
}
