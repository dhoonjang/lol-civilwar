// These styles apply to every route in the application
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Toaster from '@/components/toaster';

const inter = Inter({
  variable: '--font-inter',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head></head>
      <body className={inter.variable}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
