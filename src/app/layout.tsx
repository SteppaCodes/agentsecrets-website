import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import './globals.css';
import CommandPill from '@/components/command-pill';

const helveticaNow = localFont({
  src: [
    {
      path: './fonts/Helvetica Now/HelveticaNowDisplayLight.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Helvetica Now/HelveticaNowDisplay.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Helvetica Now/HelveticaNowDisplayMedium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Helvetica Now/HelveticaNowDisplayBold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-helvetica',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'AgentSecrets — Keep Your API Keys Hidden from AI Agents',
  description:
    'Stop pasting secrets into AI chats. AgentSecrets lets your AI agent call any API without ever seeing your credentials. Secure by design, zero-knowledge, works with Claude, MCP, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning className={`${helveticaNow.variable} ${poppins.variable}`}>
      <body className='antialiased font-sans bg-white text-[#1B1B1B]'>
        {children}
        <CommandPill />
      </body>
    </html>
  );
}
