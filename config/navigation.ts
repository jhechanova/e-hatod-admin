export type NavItem = {
  label: string;
  href: string;
  icon: string;
  children?: { label: string; href: string }[];
};

export const mainNavItems: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: "home" },
  { label: "Password Recovery", href: "/password-recovery", icon: "lock" },
  { label: "Reports", href: "/reports", icon: "document" },
  {
    label: "Chat",
    href: "/chat",
    icon: "chat",
    children: [
      { label: "Chat Room 1", href: "/chat/room-1" },
      { label: "Chat Room 2", href: "/chat/room-2" },
    ],
  },
  { label: "Branch Management", href: "/branch-management", icon: "users" },
  {
    label: "Management",
    href: "/management",
    icon: "users",
    children: [
      { label: "User Management", href: "/management/users" },
      { label: "Transaction Management", href: "/management/transactions" },
    ],
  },
  { label: "My Account", href: "/account", icon: "user" },
];

export function getAllNavPaths(): { href: string; label: string; icon: string }[] {
  const items: { href: string; label: string; icon: string }[] = [];
  for (const nav of mainNavItems) {
    if (nav.children) {
      for (const child of nav.children) {
        items.push({ href: child.href, label: child.label, icon: nav.icon });
      }
    } else {
      items.push({ href: nav.href, label: nav.label, icon: nav.icon });
    }
  }
  for (const nav of bottomNavItems) {
    items.push({ href: nav.href, label: nav.label, icon: nav.icon });
  }
  return items;
}

export const bottomNavItems: NavItem[] = [
  { label: "Contact Us", href: "/contact", icon: "phone" },
  { label: "Fees", href: "/fees", icon: "currency" },
  { label: "Customer Care", href: "/customer-care", icon: "headset" },
];
