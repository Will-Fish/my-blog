import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[28px] border border-border/80 bg-surface/90 card-shadow ${className}`}
    >
      {children}
    </div>
  );
}
