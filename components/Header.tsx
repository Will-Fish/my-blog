"use client";

import Link from "next/link";

const navItems = [
  { href: "/", label: "关于我" },
  { href: "/projects", label: "项目" },
  { href: "/blog", label: "博客" },
  { href: "/gallery", label: "摄影" },
];

type HeaderProps = {
  currentPath?: string;
};

export function Header({ currentPath = "/" }: HeaderProps) {
  const handleContactClick = () => {
    const footer = document.getElementById("site-footer");

    if (!footer) return;

    footer.scrollIntoView({ behavior: "smooth", block: "end" });
    window.dispatchEvent(new Event("footer-highlight"));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between gap-6">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight">
          Mer-Ape
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? currentPath === item.href
                : currentPath.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b pb-1 text-sm tracking-[0.16em] uppercase transition ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={handleContactClick}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          联系我
        </button>
      </div>
    </header>
  );
}
