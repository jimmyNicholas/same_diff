'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVocabulary } from '@/lib/contexts/VocabularyContext';

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
