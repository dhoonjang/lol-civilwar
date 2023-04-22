// These styles apply to every route in the application
import '@/styles/globals.css';
import localFont from 'next/font/local';
import Toaster from '@/components/toaster';

const roman = localFont({
  variable: '--font-roman',
  src: '../assets/BPlatinNumerals.ttf',
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
      <body className={`${roman.variable}`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
