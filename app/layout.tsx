import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Providers } from '@/lib/react-query/providers';
import { Notification } from '@/components/molecules/Notification';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "portier Integration Sync Panel",
  description: "Web App Integration Sync Panel for portier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Notification />
        </Providers>
      </body>
    </html>
  );
}
