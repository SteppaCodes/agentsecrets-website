import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentSecrets — Zero-Knowledge Secrets for AI Agents",
  description:
    "The only secrets tool built for AI agents to operate, not just consume. Store credentials in your OS keychain, inject them at the transport layer. The agent never sees the value.",
  keywords: [
    "AI agents",
    "secrets management",
    "zero-knowledge",
    "MCP",
    "Claude Desktop",
    "API credentials",
    "keychain",
    "agent security",
  ],
  openGraph: {
    title: "AgentSecrets — Zero-Knowledge Secrets for AI Agents",
    description:
      "Your agent calls APIs. It never sees the key. Built for the agentic era.",
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
