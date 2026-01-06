'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to financial-readiness by default
    router.push('/dashboard/financial-readiness');
  }, [router]);

  return null;
}
