import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SampahHub',
  description: 'Platform Pencocokan Multi-Material dengan Pengelola Sampah Daur Ulang',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
