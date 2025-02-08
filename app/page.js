'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from './auth/login/page';

export default function Home() {
  return <LoginPage />;
}
