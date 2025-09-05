'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem('adminSession');
    if (session) {
      router.push('/admin/dashboard');
    } else {
      router.push('/login/admin');
    }
  }, [router]);

  return null;
}
