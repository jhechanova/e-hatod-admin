"use client";

import clsx from "clsx";

interface AppHeaderProps {
  title?: string;
  className?: string;
}

export function AppHeader({ title = "dashboard", className }: AppHeaderProps) {
  const { date, time } = (() => {
    const now = new Date();
    return {
      date: now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: `${now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}H`,
    };
  })();

  return (
    <header
      className={clsx(
        "h-12 flex items-center justify-between px-6 border-b",
        "bg-[var(--dashboard-header)] border-[var(--dashboard-header-border)]",
        "text-[var(--dashboard-text-on-dark)] font-medium text-sm uppercase tracking-wide",
        className,
      )}
    >
      <span>{title}</span>
      <span className="text-[var(--dashboard-text-on-dark-muted)] text-xs font-normal normal-case">
        {date} {time}
      </span>
    </header>
  );
}
