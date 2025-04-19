import { PropsWithChildren } from 'react';
import { pressStart2P } from './fonts';
import './globals.scss';

export const metadata = {
  title: 'Rotem is a Dev',
  description: 'This site is under construction (but looking good doing it)'
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={pressStart2P.className}>{children}</body>
    </html>
  );
}
