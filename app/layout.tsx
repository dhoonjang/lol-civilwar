// These styles apply to every route in the application
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Toaster from '@/components/toaster';

const inter = Inter({
  variable: '--font-inter',
  subsets: [],
});

export const metadata = {
  title: '찌질이들의 롤대회',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.variable}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
