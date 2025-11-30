'use client';

import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/redux/store';
import { queryClient } from '@/lib/queryClient';
import { ToastProvider } from '@/components/ui/Toast';
import Navbar from '@/components/layout/Navbar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <Navbar />
              <main className="min-h-screen bg-gray-50">
                {children}
              </main>
            </ToastProvider>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}

