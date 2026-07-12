import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'DataFinOps — Commercial spend control for data-rights teams',
  description:
    'A sandbox SaaS demo for TxLINE/data-rights spend optimization, governed proposals, renewal risk, and audit-ready savings evidence.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
