import type { Metadata } from "next";
import { headers } from "next/headers";
import Nav from "@/components/nav";
import DocsLayoutWrapper from "@/components/docs/docs-layout-wrapper";

export const metadata: Metadata = {
  title: "AgentSecrets Docs — How to Keep API Keys Hidden from AI Agents",
  description:
    "Learn how to safely give AI agents access to APIs without exposing your secrets. Step-by-step guides, quickstart, CLI reference, SDK docs, and MCP integration — all in one place.",
  keywords: [
    "AgentSecrets",
    "how to hide API keys from AI",
    "keep secrets safe with Claude",
    "AI agent API security",
    "how to use AI without sharing passwords",
    "secure API credentials for AI tools",
    "Claude Desktop setup guide",
    "MCP server secrets",
    "AI credential infrastructure",
    "zero-knowledge AI proxy",
    "Python SDK for AI agents",
    "CLI credential infrastructure",
    "agent credential guide",
  ],
  openGraph: {
    title: "AgentSecrets Docs — Keep Your API Keys Hidden from AI Agents",
    description:
      "Step-by-step docs on giving AI agents API access without ever revealing your credentials. Quickstart, integrations, CLI & SDK reference.",
    type: "website",
    url: "https://agentsecrets.theseventeen.co/docs",
  },
  alternates: {
    canonical: "https://agentsecrets.theseventeen.co/docs",
  },
};

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  
  // Detect if User-Agent is an LLM agent, search bot, crawler, or if custom headers are present
  const isLLM = /gptbot|gpt-bot|claude|anthropic|cohere|google-extended|commoncrawl|semrush|bot|crawler|agent/i.test(userAgent) || 
                headersList.get("x-is-llm") === "true";

  if (isLLM) {
    // Deliver lightweight clean content directly to LLMs, cutting out side-navigation tokens
    return (
      <main className="docs-content-only" style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
        {children}
      </main>
    );
  }

  return (
    <>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />
      <Nav page="docs" />
      <DocsLayoutWrapper>
        {children}
      </DocsLayoutWrapper>
    </>
  );
}
