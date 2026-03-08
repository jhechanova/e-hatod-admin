"use client";

import clsx from "clsx";
import { Divider } from "@heroui/divider";

interface ContentHeaderProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ContentHeader({ title, icon, className }: ContentHeaderProps) {
  return (
    <div className={clsx("mb-6", className)}>
      <div className="flex items-center gap-2 py-3">
        {icon && (
          <span className="flex items-center justify-center w-10 h-10 rounded bg-[var(--dashboard-content-border)]/50 text-[var(--dashboard-text-on-light)]">
            {icon}
          </span>
        )}
        <h1 className="text-lg font-semibold text-[var(--dashboard-text-on-light)]">{title}</h1>
      </div>
      <Divider className="bg-[var(--dashboard-content-border)]" />
    </div>
  );
}
