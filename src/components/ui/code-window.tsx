"use client";

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

const STYLES = {
  container: {
    border: "1px solid var(--border)",
    borderRadius: 12,
    overflow: "clip" as const,
    background: "var(--code-bg)",
  },
  header: {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    padding: "11px 16px",
    borderBottom: "1px solid var(--border)",
    background: "var(--panel-bg)",
  },
  title: {
    fontSize: 11,
    color: "var(--muted)",
  },
  content: {
    padding: 20,
    overflowX: "auto" as const,
  },
  line: {
    display: "flex" as const,
  },
  prompt: {
    color: "var(--text)",
    marginRight: 5,
    flexShrink: 0 as const,
    userSelect: "none" as const,
  },
} as const;

function CodeLine({ line }: { line: CodeLine }) {
  if (!line.t || line.t.trim() === "") {
    return (
      <div className="cline" style={STYLES.line}>
        &nbsp;
      </div>
    );
  }

  // Dollar sign detection for command prompts
  const promptMatch = line.t.match(/^(\s*)\$(\s.*|$)/);
  if (promptMatch) {
    return (
      <div className={`cline ${line.c || "c-wh"}`} style={STYLES.line}>
        {promptMatch[1] && (
          <span style={{ whiteSpace: "pre" }}>{promptMatch[1]}</span>
        )}
        <span style={STYLES.prompt}>$</span>
        <span>{promptMatch[2]}</span>
      </div>
    );
  }

  return (
    <div className={`cline ${line.c || "c-wh"}`} style={STYLES.line}>
      {line.t}
    </div>
  );
}

export function CodeWindow({ title, lines, className = "" }: CodeWindowProps) {
  const rawText = lines.map((l) => l.t).join("\n");

  return (
    <div className={className} style={STYLES.container}>
      <div style={STYLES.header}>
        <span style={STYLES.title}>{title}</span>
        <CopyButton text={rawText} />
      </div>
      <div className="cwin-body" style={STYLES.content}>
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
    {
      ind: 1,
      parts: [
        { t: '"mcpServers"', c: "c-am" },
        { t: ": {", c: "c-wh" },
      ],
    },
    {
      ind: 2,
      parts: [
        { t: '"agentsecrets"', c: "c-em" },
        { t: ": {", c: "c-wh" },
      ],
    },
    {
      ind: 3,
      parts: [
        { t: '"command"', c: "c-sky" },
        { t: ": ", c: "c-wh" },
        { t: '"/usr/local/bin/agentsecrets"', c: "c-vi" },
        { t: ",", c: "c-wh" },
      ],
    },
    {
      ind: 3,
      parts: [
        { t: '"args"', c: "c-sky" },
        { t: ": [", c: "c-wh" },
        { t: '"mcp"', c: "c-vi" },
        { t: ", ", c: "c-wh" },
        { t: '"serve"', c: "c-vi" },
        { t: "]", c: "c-wh" },
      ],
    },
    { ind: 2, parts: [{ t: "}", c: "c-wh" }] },
    { ind: 1, parts: [{ t: "}", c: "c-wh" }] },
    { ind: 0, parts: [{ t: "}", c: "c-wh" }] },
  ];

  return (
    <div style={STYLES.container}>
      <div style={STYLES.header}>
        <span style={STYLES.title}>claude_desktop_config.json</span>
        <CopyButton text={raw} />
      </div>
      <div className="cwin-body" style={STYLES.content}>
        {rows.map((row, i) => (
          <div
            key={i}
            className="cline"
            style={{
              ...STYLES.line,
              paddingLeft: row.ind * 18,
            }}
          >
            {row.parts.map((p, j) => (
              <span key={j} className={p.c}>
                {p.t}
              </span>
            ))}
          </div>
        ))}
        <div style={{ height: 8 }} />
        <div className="cline c-di" style={STYLES.line}>
          {`// Ask Claude: "check my Stripe balance" — key value never visible.`}
        </div>
      </div>
    </div>
  );
}
