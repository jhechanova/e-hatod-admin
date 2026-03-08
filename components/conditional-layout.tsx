"use client";

import { usePathname } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";

const AUTH_PATHS = ["/", "/login", "/signup"];
const SELF_LAYOUT_PATHS = ["/dashboard"];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some(
    (p) => pathname === p || pathname?.startsWith(p + "/"),
  );
  const hasSelfLayout = SELF_LAYOUT_PATHS.some(
    (p) => pathname === p || pathname?.startsWith(p + "/"),
  );

  if (isAuthPage || hasSelfLayout) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
