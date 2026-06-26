import { NextResponse } from "next/server";
import { DOCS_SECTIONS } from "@/lib/docs-sections";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const headersList = await headers();
  const host = headersList.get("host") || "agentsecrets.theseventeen.co";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
  
  let output = `# AgentSecrets\n\n`;
  output += `AgentSecrets is zero-knowledge credential infrastructure for AI agents, combining transport-layer secret injection with cryptographic agent identity, per-secret policies, and process-level anti-impersonation.\n\n`;
  output += `It keeps credentials out of agent context entirely — no \`.env\` files, no environment variable leaks, no plaintext in LLM memory. Agents call APIs by reference name; secrets are resolved from the OS keychain and injected at the transport layer by a local proxy guarded by the \`keychain-auth\` daemon.\n\n`;
  output += `## Key Features\n`;
  output += `- **Cryptographic Agent Identity**: Register agents with signed tokens (\`agentsecrets agent register\`). Every credential access is attributed to a specific agent.\n`;
  output += `- **Agent Policies**: Bind secrets to specific agents via allow/deny lists (\`agentsecrets agent policy set\`). An email agent never touches the Stripe key.\n`;
  output += `- **Secret Constraints**: Lock individual secrets to specific domains and HTTP methods (\`agentsecrets secrets policy set\`). STRIPE_KEY only works on api.stripe.com.\n`;
  output += `- **Keychain Auth (\`keychain-auth\`)**: Verifies the calling binary's SHA-256 hash before releasing any credential. Rogue scripts are denied at the IPC handshake.\n`;
  output += `- **Transport Layer Injection**: SDK requests (OpenAI, Stripe, GitHub) are intercepted by the local proxy. Credentials are injected mid-flight; the agent never sees the raw value.\n`;
  output += `- **Zero-Knowledge Sync**: E2E encrypted local key database. The cloud server cannot decrypt your keys.\n`;
  output += `- **Domain Allowlist**: Strict egress rules to prevent prompt injection credential theft.\n\n`;
  
  output += `## Search the Documentation\n`;
  output += `You can programmatically search this documentation by making a GET request to: \`${baseUrl}/api/search?q=<query>\`\n`;
  output += `Calling this endpoint with an LLM crawler or requesting text format returns search results in a clean, navigationless markdown list of relevant articles, snippets, and deep links. Use this to quickly find specific guides, troubleshooting steps, or comparison details.\n\n`;

  output += `## Documentation Map\n\n`;

  DOCS_SECTIONS.forEach((s) => {
    output += `- [${s.label}](${baseUrl}/docs/${s.id === "what-is-agentsecrets" ? "" : s.id})\n`;
  });

  output += `\nFor a single-file consolidated version of the entire documentation suite, see: ${baseUrl}/llms-full.txt\n`;

  return new NextResponse(output, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
