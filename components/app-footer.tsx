"use client";

import clsx from "clsx";

interface AppFooterProps {
  className?: string;
}

export function AppFooter({ className }: AppFooterProps) {
  return (
    <footer
      className={clsx(
        "h-12 flex items-center justify-end px-6 border-t",
        "bg-[var(--dashboard-content)] border-[var(--dashboard-content-border)]",
        "text-[var(--dashboard-text-on-light-muted)] text-sm",
        className,
      )}
    >
      © 2025 BOHOL e-Hatod Version 1.0
    </footer>
  );
}
