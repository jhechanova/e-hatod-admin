"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import clsx from "clsx";

import {
  ChatIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyIcon,
  DocumentIcon,
  HeadsetIcon,
  HomeIcon,
  LockIcon,
  Logo,
  LogoutIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";
import { mainNavItems, bottomNavItems } from "@/config/navigation";
import { logout } from "@/lib/auth";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
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

export function Sidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "/chat": true,
    "/management": true,
  });
  const pathname = usePathname();

  const toggleSection = (href: string) => {
    if (!isCollapsed) {
      setExpandedSections((prev) => ({ ...prev, [href]: !prev[href] }));
    }
  };

  const NavLink = ({
    href,
    icon,
    label,
    isActive,
  }: {
    href: string;
    icon: string;
    label: string;
    isActive: boolean;
  }) => {
    const IconComponent = iconMap[icon] ?? HomeIcon;
    return (
      <NextLink href={href}>
        <div
          className={clsx(
            "flex items-center gap-4 px-3 py-3 rounded-lg transition-colors",
            "text-[var(--dashboard-text-on-dark)]",
            "hover:bg-white/10",
            isActive && "bg-[var(--dashboard-sidebar-active)]",
          )}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[var(--dashboard-text-on-dark)]">
            <IconComponent className="h-full w-full" />
          </span>
          {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
        </div>
      </NextLink>
    );
  };

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
    <aside
      className={clsx(
        "flex flex-col shrink-0 border-r",
        "bg-[var(--dashboard-sidebar)] border-[var(--dashboard-sidebar-border)]",
        "transition-[width] duration-200 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-64",
      )}
    >
      {/* Logo & Brand */}
      <div>
        <div className="px-4 pt-4 text-[var(--dashboard-text-on-dark-muted)] text-xs font-normal normal-case">
          {date} {time}
        </div>
        <div className="px-4 py-2 flex items-center gap-3 border-b border-[var(--dashboard-sidebar-border)]">
          <Logo className="text-[var(--dashboard-text-on-dark)] shrink-0" size={32} />
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="font-bold text-[var(--dashboard-text-on-dark)] text-sm truncate">
                BOHOL e-Hatod
              </p>
              <p className="text-[var(--dashboard-text-on-dark-muted)] text-xs truncate">
                Assistant System Administrator
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!isCollapsed && (
          <p className="px-3 mb-3 text-[var(--dashboard-text-on-dark)] text-xs font-semibold uppercase tracking-wider">
            Main
          </p>
        )}
        {mainNavItems.map((item) => {
          if (item.children) {
            const isChildActive = item.children.some(
              (c) => pathname === c.href || pathname.startsWith(c.href + "/"),
            );
            const isExpanded = expandedSections[item.href] ?? true;
            const IconComponent = iconMap[item.icon] ?? HomeIcon;
            return (
              <div key={item.href}>
                <div
                  className={clsx(
                    "flex items-center justify-between gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors",
                    "text-[var(--dashboard-text-on-dark)]",
                    "hover:bg-white/10",
                    (pathname === item.href || isChildActive) &&
                      "bg-[var(--dashboard-sidebar-active)]",
                  )}
                  onClick={() => toggleSection(item.href)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    toggleSection(item.href)
                  }
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[var(--dashboard-text-on-dark)]">
                      <IconComponent className="h-full w-full" />
                    </span>
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </div>
                  {!isCollapsed && item.children && (
                    <ChevronDownIcon
                      className={clsx(
                        "h-4 w-4 shrink-0 transition-transform",
                        isExpanded && "rotate-180",
                      )}
                    />
                  )}
                </div>
                {!isCollapsed && isExpanded && item.children && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-white/20 pl-3">
                    {item.children.map((child) => (
                      <NextLink key={child.href} href={child.href}>
                        <div
                          className={clsx(
                            "flex items-center gap-2 px-2 py-2 rounded-lg transition-colors",
                            "text-[var(--dashboard-text-on-dark)]",
                            "hover:bg-white/10",
                            pathname === child.href &&
                              "bg-[var(--dashboard-sidebar-active)]"
                          )}
                        >
                          <span className="text-sm">{child.label}</span>
                        </div>
                      </NextLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href))
              }
            />
          );
        })}

        <div className="pt-6 mt-4 border-t border-[var(--dashboard-sidebar-border)]">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-[var(--dashboard-sidebar-border)]">
        <Button
          className="w-full justify-start text-[var(--dashboard-text-on-dark)] hover:bg-white/10"
          startContent={
            <LogoutIcon className="h-5 w-5 text-[var(--dashboard-text-on-dark)]" />
          }
          variant="light"
          onPress={() => logout(router.push)}
        >
          {!isCollapsed && "Logout"}
        </Button>
      </div>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-[var(--dashboard-sidebar-border)]">
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="w-full text-[var(--dashboard-text-on-dark)] hover:bg-white/10"
          onPress={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5 text-[var(--dashboard-text-on-dark)]" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 text-[var(--dashboard-text-on-dark)]" />
          )}
        </Button>
      </div>
    </aside>
  );
}
