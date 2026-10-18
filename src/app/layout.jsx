import { Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  weight: ['100', '200', '400', '500', '600', '800'],
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Lumiere Spa Studio - Sanctuary of Mind & Body',
  description: 'Experience pure tranquility, holistic therapies, and personalized spa treatments at Lumiere Spa Studio.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
