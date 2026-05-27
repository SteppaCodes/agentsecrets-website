import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Poppins, Fraunces } from 'next/font/google';
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

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fraunces',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'AgentSecrets — Zero-Knowledge Credential Infrastructure for AI Agents',
  description:
    'Stop exposing credentials to LLMs. AgentSecrets is a zero-knowledge credential infrastructure that lets AI agents call any API by reference, without ever holding raw key values in memory.',
  keywords: [
    'AI credential infrastructure',
    'secure credential orchestration for AI agents',
    'zero-knowledge secrets storage',
    'credential management for LLMs',
    'Claude MCP secrets',
    'API key proxy for AI',
    'prevent prompt injection key theft',
    'agent security architecture',
    'Zero-Knowledge MCP Server',
    'OS Keychain credential infrastructure',
  ],
  openGraph: {
    title: 'AgentSecrets — Zero-Knowledge Credential Infrastructure for AI Agents',
    description:
      'Keep your API keys completely hidden from AI models and LLM agents. Zero-knowledge local credentials proxy with domain egress protection.',
    url: 'https://agentsecrets.theseventeen.co',
    siteName: 'AgentSecrets',
    images: [
      {
        url: 'https://agentsecrets.theseventeen.co/Logo.png',
        width: 1200,
        height: 630,
        alt: 'AgentSecrets Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentSecrets — Keep API Keys Hidden from AI Agents',
    description:
      'Stop pasting secrets into AI chats. Give your AI agents API access without sharing your credentials. Zero-knowledge proxy.',
    images: ['https://agentsecrets.theseventeen.co/Logo.png'],
  },
  alternates: {
    canonical: 'https://agentsecrets.theseventeen.co',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning className={`${helveticaNow.variable} ${poppins.variable} ${fraunces.variable}`}>
      <body className='antialiased font-sans bg-white text-[#1B1B1B]'>
        {children}
        <CommandPill />
      </body>
    </html>
  );
}
