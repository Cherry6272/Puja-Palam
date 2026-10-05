import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/store/CartDrawer';

export const metadata: Metadata = {
  title: 'Samptrapthi — Next-Generation Ritual Procurement Platform',
  description:
    'From the first item to the final offering, Samptrapthi brings every ritual requirement together — thoughtfully curated, accurately prepared and delivered with ease.',
  keywords: [
    'Puja Samagri',
    'Ritual Procurement',
    'Satyanarayana Puja Items',
    'Ganapati Puja Samagri',
    'Griha Pravesh Items List',
    'Varalakshmi Vratam Samagri',
    'Puja Kits Bangalore Chennai Hyderabad',
    'Vedic Rituals',
  ],
  openGraph: {
    title: 'Samptrapthi — Your ritual. Everything it needs.',
    description:
      'The Next-Generation Ritual Procurement Platform. Structured Vedic intelligence, 3D interactive ritual setups, and personalized puja kits.',
    url: 'https://samptrapthi.com',
    siteName: 'Samptrapthi',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-sandalwood-50 text-temple-900 antialiased selection:bg-brass-200 selection:text-temple-900">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
