import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import SessionProvider from '@/components/layout/SessionProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700','800'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'PackGo — Your Journey, Our Passion',
  description: 'Discover handcrafted travel packages across India and the world. Book your dream trip with PackGo.',
  keywords: 'travel, tour packages, India travel, holiday packages, PackGo',
  openGraph: {
    title: 'PackGo — Your Journey, Our Passion',
    description: 'Discover handcrafted travel packages across India and the world.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans bg-white text-gray-900 antialiased">
        <SessionProvider>
          {children}
          <Toaster position="top-center" toastOptions={{ duration: 3000, style: { borderRadius: '12px', fontFamily: 'var(--font-inter)' } }} />
        </SessionProvider>
      </body>
    </html>
  );
}
