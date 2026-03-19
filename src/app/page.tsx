"use client";
import BgCanvas from "@/components/bg-canvas";
import Nav from "@/components/nav";
import Hero from "@/components/hero";
import FlowDemo from "@/components/flow-demo";
import SecretTheater from "@/components/secret-theater";
import ComparisonTable from "@/components/comparison-table";
import FeaturesGrid from "@/components/features-grid";
import Integrations from "@/components/integrations";
import InstallSection from "@/components/install-section";
import CTA from "@/components/cta";
import { motion } from "framer-motion";

function Section({
  id,
  tag,
  title,
  sub,
  children,
}: {
  id?: string;
  tag: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="page-section"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "96px 40px",
        maxWidth: 1160,
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div
          style={{
            fontSize: 10,
            color: "var(--em)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          {tag}
        </div>
        <h2
          style={{
            fontSize: "clamp(22px,3vw,38px)",
            fontWeight: 700,
            letterSpacing: "-0.8px",
            lineHeight: 1.12,
            marginBottom: 14,
          }}
        >
          {title}
        </h2>
        {sub && (
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 2, maxWidth: 520 }}>
            {sub}
          </p>
        )}
      </motion.div>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <>
      <BgCanvas />
      <div className="grid-bg" />
      <div className="blob" style={{ width: 500, height: 500, top: -80, left: "20%", background: "rgba(0,255,135,0.04)" }} />
      <div className="blob" style={{ width: 380, height: 380, top: "40%", right: -80, background: "rgba(255,184,0,0.03)" }} />
      <div className="blob" style={{ width: 500, height: 260, bottom: "15%", left: "10%", background: "rgba(0,255,135,0.03)" }} />

      <Nav page="home" />

      {/* Hero */}
      <div style={{ paddingTop: 60 }}>
        <Hero />
      </div>

      {/* Live protocol demo */}
      <Section
        tag="HOW IT WORKS"
        title="Watch it execute."
        sub="Click run and watch a real Stripe API call go through the protocol. The terminal shows exactly what happens and what never does."
      >
        <FlowDemo />
      </Section>

      {/* Secret theater */}
      <Section
        tag="THE MODEL"
        title="Injection at the right layer."
        sub="This is the moment where other tools fail. Here's what makes AgentSecrets different — visualized in real time."
      >
        <SecretTheater />
      </Section>

      {/* Features */}
      <Section
        id="features"
        tag="FEATURES"
        title="Everything that needed to exist."
      >
        <FeaturesGrid />
      </Section>

      {/* Integrations / Build on It */}
      <div id="build-on-it" />
      <Section
        id="integrations"
        tag="INTEGRATIONS"
        title="Works where you already work."
        sub="MCP for Claude Desktop and Cursor. HTTP proxy for any agent framework. Env injection for tools that read from environment variables."
      >
        <Integrations />
      </Section>

      {/* Comparison */}
      <Section
        tag="VS."
        title="Built for agents. The rest were not."
        sub="Other tools protect credentials at rest. AgentSecrets protects them in use, which is the only moment that matters when an agent is running."
      >
        <ComparisonTable />
      </Section>

      {/* Install */}
      <Section
        tag="GET STARTED"
        title="One command."
        sub="Free and open source. No usage limits."
      >
        <InstallSection />
      </Section>

      {/* CTA */}
      <CTA />

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "22px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 26, height: 26, borderRadius: 6,
              border: "1px solid var(--border-em)",
              background: "rgba(0,255,135,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11,
            }}
          >
            🔐
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
            agent<span style={{ color: "var(--em)" }}>secrets</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <a
            href="https://github.com/The-17/agentsecrets"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--em)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
          >
            GitHub
          </a>
          <a
            href="/docs"
            style={{ fontSize: 11, color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--em)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
          >
            Docs
          </a>
          <a
            href="https://github.com/The-17/agentsecrets/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--em)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
          >
            MIT License
          </a>
        </div>
        <span style={{ fontSize: 11, color: "var(--muted)" }}>
          © 2026 The Seventeen · You cannot steal what was never there.
        </span>
      </footer>
    </>
  );
}
