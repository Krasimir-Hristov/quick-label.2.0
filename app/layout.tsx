import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import HeaderNav from '@/components/shared/HeaderNav';
import { AuthProvider } from '@/components/AuthContext';
import { lexiaStd, dinEngschriftStd } from '@/lib/features/labels/fonts';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Quick Label Generator',
  description: 'Generate professional labels for products',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lexiaStd.variable} ${dinEngschriftStd.variable} antialiased`}
      >
        <AuthProvider>
          <HeaderNav />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
