"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path d="M3.75 6.75h16.5v10.5H3.75z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4.5 7.5 7.02 5.265a.8.8 0 0 0 .96 0L19.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M12 .5a12 12 0 0 0-3.794 23.386c.6.111.82-.261.82-.58 0-.287-.011-1.242-.016-2.252-3.338.726-4.042-1.417-4.042-1.417-.547-1.39-1.334-1.76-1.334-1.76-1.09-.746.082-.731.082-.731 1.206.085 1.84 1.238 1.84 1.238 1.072 1.836 2.812 1.306 3.497.999.108-.776.419-1.306.762-1.606-2.665-.303-5.467-1.333-5.467-5.931 0-1.31.469-2.381 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.323 3.301 1.23A11.47 11.47 0 0 1 12 6.317a11.48 11.48 0 0 1 3.006.404c2.291-1.553 3.298-1.23 3.298-1.23.654 1.652.243 2.873.119 3.176.77.839 1.235 1.91 1.235 3.22 0 4.609-2.807 5.625-5.48 5.921.431.371.815 1.102.815 2.222 0 1.605-.014 2.899-.014 3.293 0 .322.216.696.825.578A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function DouyinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M14.52 3.5c.46 2.63 2.01 4.42 4.48 5.2v3.06a8.02 8.02 0 0 1-4.29-1.53v5.08c0 3.77-2.92 6.19-6.47 6.19-3.72 0-6.24-2.86-6.24-6 0-3.45 2.78-6.23 6.54-6.23.35 0 .67.02.99.09v3.16a3.75 3.75 0 0 0-.98-.13c-1.78 0-3.25 1.3-3.25 3.01 0 1.86 1.24 3.03 2.95 3.03 1.64 0 3.18-1.05 3.18-3.88V3.5h3.09Z" />
    </svg>
  );
}

function VisualChinaIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 overflow-visible">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" className="fill-[#d81f26]" />
      <path
        d="M7.4 8.2h9.2M7.4 12h5.7M7.4 15.8h9.2"
        stroke="rgba(255,255,255,0.92)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <text x="12" y="16.4" textAnchor="middle" className="fill-white" fontSize="8.5" fontWeight="700">
        视觉
      </text>
    </svg>
  );
}

const socialLinks = [
  {
    href: "https://github.com/Will-Fish",
    label: "GitHub",
    icon: GithubIcon,
  },
  {
    href: "https://v.douyin.com/06KHRiW9i1g/",
    label: "抖音",
    icon: DouyinIcon,
  },
  {
    href: "https://500px.com.cn/Willphotographer",
    label: "视觉中国",
    icon: VisualChinaIcon,
  },
];

const EMAIL_ADDRESS = "yuweixin2020@email.szu.edu.cn";

export function Footer() {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isEmailBubbleVisible, setIsEmailBubbleVisible] = useState(false);
  const [emailCopyStatus, setEmailCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const emailStatusTimerRef = useRef<number | undefined>(undefined);
  const emailHideTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let timeoutId: number | undefined;

    const triggerHighlight = () => {
      setIsHighlighted(false);
      window.clearTimeout(timeoutId);

      requestAnimationFrame(() => {
        setIsHighlighted(true);
        timeoutId = window.setTimeout(() => setIsHighlighted(false), 2200);
      });
    };

    window.addEventListener("footer-highlight", triggerHighlight);
    return () => {
      window.removeEventListener("footer-highlight", triggerHighlight);
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(emailStatusTimerRef.current);
      window.clearTimeout(emailHideTimerRef.current);
    };
  }, []);

  const showEmailBubble = () => {
    window.clearTimeout(emailHideTimerRef.current);
    setIsEmailBubbleVisible(true);
  };

  const hideEmailBubbleWithDelay = () => {
    window.clearTimeout(emailHideTimerRef.current);
    emailHideTimerRef.current = window.setTimeout(() => {
      setIsEmailBubbleVisible(false);
    }, 140);
  };

  const handleEmailCopy = async () => {
    window.clearTimeout(emailStatusTimerRef.current);

    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setEmailCopyStatus("success");
    } catch {
      setEmailCopyStatus("error");
    }

    setIsEmailBubbleVisible(true);
    emailStatusTimerRef.current = window.setTimeout(() => {
      setEmailCopyStatus("idle");
    }, 1800);
  };

  return (
    <footer
      id="site-footer"
      className={`mt-auto border-t border-border/80 transition-[background-color,box-shadow] duration-700 ${
        isHighlighted ? "bg-primary-soft/55 shadow-[0_-18px_50px_-35px_rgba(15,79,60,0.65)]" : ""
      }`}
    >
      <div className="page-shell flex flex-col gap-8 py-10 text-sm text-text-muted md:flex-row md:items-end md:justify-between">
        <div className="max-w-md space-y-3">
          <div className="flex items-center gap-3">
            <div className="font-serif text-lg text-foreground">Mer-Ape</div>
            <span className="text-xs uppercase tracking-[0.24em] text-primary">鱼尾猩</span>
          </div>
          <p className="leading-7">会当水击三千里，自信人生二百年</p>
        </div>
        <div className="flex flex-col items-start gap-5 md:items-end">
          <div
            className={`flex flex-wrap items-center gap-3 transition-all duration-500 ${
              isHighlighted ? "translate-y-[-2px]" : ""
            }`}
          >
            <div
              className="relative"
              onMouseEnter={showEmailBubble}
              onMouseLeave={hideEmailBubbleWithDelay}
            >
              <button
                type="button"
                onClick={handleEmailCopy}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-500 ${
                  isHighlighted
                    ? "border-primary bg-white text-primary shadow-[0_14px_34px_-20px_rgba(15,79,60,0.95)]"
                    : "border-border bg-surface hover:border-primary/40 hover:text-primary"
                }`}
              >
                <MailIcon />
                <span>邮箱</span>
              </button>
              <div
                className={`absolute bottom-full left-1/2 z-10 mb-3 w-max max-w-[320px] -translate-x-1/2 rounded-xl border border-border bg-surface px-3 py-2 text-xs leading-5 text-foreground shadow-[0_12px_28px_-20px_rgba(15,79,60,0.8)] transition-all duration-[2000ms] ${
                  isEmailBubbleVisible
                    ? "translate-y-0 pointer-events-auto opacity-100"
                    : "pointer-events-none translate-y-1 opacity-0"
                }`}
                onMouseEnter={showEmailBubble}
                onMouseLeave={hideEmailBubbleWithDelay}
                role="status"
                aria-live="polite"
              >
                {emailCopyStatus === "success"
                  ? "邮箱地址已复制到剪贴板"
                  : emailCopyStatus === "error"
                    ? "复制失败，请手动复制"
                    : EMAIL_ADDRESS}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b border-border bg-surface"
                />
              </div>
            </div>

            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-500 ${
                  isHighlighted
                    ? "border-primary bg-white text-primary shadow-[0_14px_34px_-20px_rgba(15,79,60,0.95)]"
                    : "border-border bg-surface hover:border-primary/40 hover:text-primary"
                }`}
              >
                <Icon />
                <span>{label}</span>
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3 text-right">
            <span>Designed &amp; curated by Mer-Ape</span>
            <Image
              src="/icon.png"
              alt="Mer Ape logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-2xl border border-border bg-surface object-cover shadow-[0_12px_30px_-24px_rgba(15,79,60,0.9)]"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
