import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'DataFinOps — TxLINE World Cup 2026 spend control',
  description:
    'A sandbox SaaS demo for TxLINE World Cup 2026 fixture coverage, odds and scores replay, governed proposals, settlement proofs, renewal risk, and audit-ready savings evidence.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
