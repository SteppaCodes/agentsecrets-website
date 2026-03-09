"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavProps {
  page: "home" | "docs";
  onNavigate: (page: "home" | "docs") => void;
}

const NAV_LINKS = [
  { label: "How it works", id: "how-it-works" },
  { label: "Build on It", id: "build-on-it" },
];

export default function Nav({ page, onNavigate }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (page !== "home") {
      onNavigate("home");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100, height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          background: "var(--nav-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <motion.button
          onClick={() => onNavigate("home")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "none", border: "none", cursor: "pointer",
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            border: "1.5px solid var(--border-em)",
            background: "rgba(0,255,135,0.07)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute", inset: "-40%",
                background: "conic-gradient(transparent 0deg,#00ff87 80deg,transparent 160deg)",
                opacity: 0.25,
              }}
            />
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="#00ff87" strokeWidth="1.5"
              style={{ position: "relative", zIndex: 1 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <span className="logo-text" style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "inherit" }}>
            agent<span style={{ color: "var(--em)" }}>secrets</span>
          </span>
        </motion.button>

        {/* Desktop nav links */}
        <div style={{ display: "flex", gap: 24, alignItems: "center" }} className="nav-links-desktop">
          {page === "home" && NAV_LINKS.map(({ label, id }) => (
            <motion.button
              key={id}
              onClick={() => scrollTo(id)}
              whileHover={{ color: "var(--em)" }}
              style={{
                fontSize: 11, color: "var(--muted)", background: "none",
                border: "none", cursor: "pointer", letterSpacing: "0.04em",
                fontFamily: "inherit", transition: "color 0.2s",
              }}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <motion.button
            // className="nav-docs-btn"
            whileHover={{ borderColor: "var(--border-em)", color: "var(--em)", background: "rgba(0,255,135,0.05)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate(page === "docs" ? "home" : "docs")}
            style={{
              fontSize: 11, fontWeight: 700, padding: "7px 16px", borderRadius: 7,
              border: `1px solid ${page === "docs" ? "var(--border-em)" : "var(--border)"}`,
              color: page === "docs" ? "var(--em)" : "var(--muted)",
              background: page === "docs" ? "rgba(0,255,135,0.05)" : "transparent",
              cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
            }}
          >
            {page === "docs" ? "← Site" : "Docs"}
          </motion.button>
          <motion.a
            className="nav-gh"
            whileHover={{ background: "var(--text)", y: -1, boxShadow: "0 6px 20px rgba(0,255,135,0.25)" }}
            whileTap={{ scale: 0.96 }}
            href="https://github.com/The-17/agentsecrets"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11, fontWeight: 700, padding: "7px 16px", borderRadius: 7,
              background: "var(--em)", color: "var(--bg)", textDecoration: "none",
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </motion.a>

          {/* Hamburger for mobile */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-hamburger"
            style={{
              display: "none",
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 7,
              padding: "9px 11px",
              cursor: "pointer",
              color: "var(--muted)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 60, left: 0, right: 0,
              zIndex: 99,
              background: "var(--nav-bg)",
              backdropFilter: "blur(24px)",
              borderBottom: "1px solid var(--border)",
              padding: "16px 24px 20px",
              maxHeight: "calc(100vh - 60px)",
              overflowY: "auto",
            }}
          >
            {page === "home" && NAV_LINKS.map(({ label, id }, i) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => scrollTo(id)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "12px 4px", fontSize: 13, color: "var(--muted)",
                  background: "none", border: "none", cursor: "pointer",
                  borderBottom: "1px solid var(--border)", fontFamily: "inherit",
                  letterSpacing: "0.04em",
                }}
              >
                {label}
              </motion.button>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                onClick={() => { onNavigate(page === "docs" ? "home" : "docs"); setMenuOpen(false); }}
                style={{
                  flex: 1, padding: "10px", fontSize: 12, fontWeight: 700,
                  border: "1px solid var(--border-em)", borderRadius: 8,
                  color: "var(--em)", background: "rgba(0,255,135,0.06)",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {page === "docs" ? "← Site" : "Docs"}
              </button>
              <a
                href="https://github.com/The-17/agentsecrets"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, padding: "10px", fontSize: 12, fontWeight: 700,
                  background: "var(--em)", color: "var(--bg)", textDecoration: "none",
                  borderRadius: 8, display: "block", textAlign: "center",
                }}
              >
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
