'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';

import { getQueryClient } from './queryClient';

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevents server-side rendering of the application tree
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
