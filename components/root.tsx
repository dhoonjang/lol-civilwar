'use client';

export { Toaster } from 'react-hot-toast';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { toast } from 'react-hot-toast';

const client = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        toast.error(JSON.stringify(error));
      },
    },
  },
});

export const Provider = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);
