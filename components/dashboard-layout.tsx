"use client";

import { usePathname } from "next/navigation";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { ContentHeader } from "@/components/content-header";
import {
  ChatIcon,
  CurrencyIcon,
  DocumentIcon,
  HeadsetIcon,
  HomeIcon,
  LockIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";
import { Sidebar } from "@/components/sidebar";
import {
  bottomNavItems,
  getAllNavPaths,
  mainNavItems,
} from "@/config/navigation";

const allNavItems = getAllNavPaths();

const contentIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  home: HomeIcon,
  search: SearchIcon,
  lock: LockIcon,
  document: DocumentIcon,
  chat: ChatIcon,
  users: UsersIcon,
  user: UserIcon,
  phone: PhoneIcon,
  currency: CurrencyIcon,
  headset: HeadsetIcon,
};

const CHAT_ROOM_TITLES: Record<string, string> = {
  "/chat/room-1": "Chat Room 1 > My Municipal Administrator",
  "/chat/room-2": "Chat Room 2 > My Branch Managers",
};

function getCurrentNavItem(pathname: string) {
  const exact = allNavItems.find((nav) => nav.href === pathname);
  if (exact) return exact;
  return allNavItems.find(
    (nav) => nav.href !== "/dashboard" && pathname.startsWith(nav.href),
  );
}

function getPageTitle(pathname: string, navItem: { label: string } | undefined) {
  return CHAT_ROOM_TITLES[pathname] ?? navItem?.label ?? pathname.slice(1).replace(/-/g, " ");
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItem = getCurrentNavItem(pathname);
  const pageTitle = getPageTitle(pathname, navItem);
  const IconComponent = navItem
    ? contentIconMap[navItem.icon] ?? HomeIcon
    : HomeIcon;

  return (
    <div className="flex h-screen min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 bg-[var(--dashboard-content)]">
        <main className="flex-1 overflow-auto p-6">
          <ContentHeader
            icon={<IconComponent className="h-5 w-5" />}
            title={pageTitle}
          />
          <div className="text-[var(--dashboard-text-on-light)]">
            {children}
          </div>
        </main>
        <AppFooter />
      </div>
    </div>
  );
}
