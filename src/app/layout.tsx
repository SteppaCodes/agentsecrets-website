import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "AgentSecrets — Keep Your API Keys Hidden from AI Agents",
  description:
    "Stop pasting secrets into AI chats. AgentSecrets lets your AI agent call any API without ever seeing your credentials. Secure by design, zero-knowledge, works with Claude, MCP, and more.",
  keywords: [
    "AgentSecrets",
    "how to give AI access to my accounts safely",
    "keep AI from seeing my passwords",
    "AI agent API key security",
    "hide secrets from AI",
    "AI that can use APIs without knowing your password",
    "secure secrets for Claude",
    "MCP secrets management",
    "AI productivity tools",
    "safe AI automation",
    "AI agent credential manager",
    "zero-knowledge secrets",
    "Claude Desktop integration",
  ],
  openGraph: {
    title: "AgentSecrets — Your AI Agent Calls APIs. It Never Sees the Key.",
    description:
      "Stop pasting API keys into chats. AgentSecrets injects credentials at the transport layer so your AI agent gets access — without ever knowing your secrets.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
