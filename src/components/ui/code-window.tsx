import { CopyButton } from "./copy-button";

interface CodeLine {
  t: string;
  c?: string;
}

interface CodeWindowProps {
  title?: string;
  lines: CodeLine[];
  className?: string;
}

function CodeLine({ line }: { line: CodeLine }) {
  if (!line.t || line.t.trim() === "") {
    return (
      <div className="cline" style={{ fontSize: 12, lineHeight: "2.1", display: "flex" }}>
        &nbsp;
      </div>
    );
  }
  // dollar sign detection
  const m = line.t.match(/^(\s*)\$(\s.*|$)/);
  if (m) {
    return (
      <div className={`cline ${line.c || "c-wh"}`} style={{ fontSize: 12, lineHeight: "2.1", display: "flex" }}>
        {m[1] && <span style={{ whiteSpace: "pre" }}>{m[1]}</span>}
        <span style={{ color: "#ffffff", marginRight: 5, flexShrink: 0, userSelect: "none" }}>$</span>
        <span>{m[2]}</span>
      </div>
    );
  }
  return (
    <div className={`cline ${line.c || "c-wh"}`} style={{ fontSize: 12, lineHeight: "2.1", display: "flex" }}>
      {line.t}
    </div>
  );
}

export function CodeWindow({ title, lines, className = "" }: CodeWindowProps) {
  const rawText = lines.map((l) => l.t).join("\n");

  return (
    <div
      className={className}
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        background: "var(--code-bg)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "11px 16px",
          borderBottom: "1px solid var(--border)",
          background: "rgba(255,255,255,0.012)",
        }}
      >
        <span style={{ fontSize: 11, color: "var(--muted)" }}>{title}</span>
        <CopyButton text={rawText} />
      </div>
      <div style={{ padding: 20 }}>
        {lines.map((line, i) => (
          <CodeLine key={i} line={line} />
        ))}
      </div>
    </div>
  );
}

export function McpJsonWindow() {
  const raw = `{
  "mcpServers": {
    "agentsecrets": {
      "command": "/usr/local/bin/agentsecrets",
      "args": ["mcp", "serve"]
    }
  }
}`;

  const rows = [
    { ind: 0, parts: [{ t: "{", c: "c-wh" }] },
    { ind: 1, parts: [{ t: '"mcpServers"', c: "c-am" }, { t: ": {", c: "c-wh" }] },
    { ind: 2, parts: [{ t: '"agentsecrets"', c: "c-em" }, { t: ": {", c: "c-wh" }] },
    { ind: 3, parts: [{ t: '"command"', c: "c-sky" }, { t: ": ", c: "c-wh" }, { t: '"/usr/local/bin/agentsecrets"', c: "c-vi" }, { t: ",", c: "c-wh" }] },
    { ind: 3, parts: [{ t: '"args"', c: "c-sky" }, { t: ": [", c: "c-wh" }, { t: '"mcp"', c: "c-vi" }, { t: ", ", c: "c-wh" }, { t: '"serve"', c: "c-vi" }, { t: "]", c: "c-wh" }] },
    { ind: 2, parts: [{ t: "}", c: "c-wh" }] },
    { ind: 1, parts: [{ t: "}", c: "c-wh" }] },
    { ind: 0, parts: [{ t: "}", c: "c-wh" }] },
  ];

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "var(--code-bg)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.012)" }}>
        <span style={{ fontSize: 11, color: "var(--muted)" }}>claude_desktop_config.json</span>
        <CopyButton text={raw} />
      </div>
      <div style={{ padding: 20 }}>
        {rows.map((row, i) => (
          <div key={i} className="cline" style={{ paddingLeft: row.ind * 18, display: "flex", fontSize: 12, lineHeight: "2.1" }}>
            {row.parts.map((p, j) => (
              <span key={j} className={p.c}>{p.t}</span>
            ))}
          </div>
        ))}
        <div style={{ height: 8 }} />
        <div className="cline c-di" style={{ fontSize: 12, lineHeight: "2.1" }}>// Ask Claude: "check my Stripe balance" — key value never visible.</div>
      </div>
    </div>
  );
}
