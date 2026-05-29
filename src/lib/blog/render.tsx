import * as React from "react";

/**
 * Renders the markdown-lite blog body used by seed and generated posts:
 *   `## heading`, blank-line-separated paragraphs, and `- ` bullet lists.
 * Intentionally tiny — no third-party markdown dependency, no raw HTML.
 */
export function renderBody(body: string): React.ReactNode {
  const blocks = body.trim().split(/\n{2,}/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();

    if (trimmed.startsWith("## ")) {
      return <h2 key={i}>{trimmed.slice(3).trim()}</h2>;
    }
    if (trimmed.startsWith("### ")) {
      return <h3 key={i}>{trimmed.slice(4).trim()}</h3>;
    }

    const lines = trimmed.split("\n");
    if (lines.every((l) => l.trim().startsWith("- "))) {
      return (
        <ul key={i}>
          {lines.map((l, j) => (
            <li key={j}>{l.trim().slice(2)}</li>
          ))}
        </ul>
      );
    }

    return <p key={i}>{trimmed}</p>;
  });
}
