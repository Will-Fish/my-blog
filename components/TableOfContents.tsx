"use client";

import type { MouseEvent } from "react";
import type { Heading } from "@/lib/markdown";

type TableOfContentsProps = {
  headings: Heading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  const resolveTargetId = (id: string) => {
    if (document.getElementById(id)) {
      return id;
    }

    const prefixedId = `user-content-${id}`;
    if (document.getElementById(prefixedId)) {
      return prefixedId;
    }

    return id;
  };

  const handleJump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();

    const targetId = resolveTargetId(id);
    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", `#${targetId}`);
  };

  return (
    <nav aria-label="文章目录" className="rounded-[24px] border border-border/80 bg-surface/80 p-6 card-shadow">
      <div className="text-sm uppercase tracking-[0.18em] text-primary">文章目录</div>
      <div className="mt-4 space-y-3">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#user-content-${heading.id}`}
            onClick={(event) => handleJump(event, heading.id)}
            className={`block text-sm leading-6 text-text-muted transition hover:text-primary ${
              heading.level === 3 ? "pl-4" : ""
            }`}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
