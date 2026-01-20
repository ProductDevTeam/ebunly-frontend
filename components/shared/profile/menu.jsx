"use client";

import { ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const ProfileMenu = () => {
  const accountItems = [
    {
      label: "Edit Profile",
      href: "/profile/edit",
      hasArrow: true,
    },
    {
      label: "Your Orders",
      href: "/profile/orders",
      hasArrow: true,
    },
    {
      label: "Referrals",
      href: "/referrals",
      hasArrow: false,
      badge: "Coming Soon",
    },
  ];

  const ebunlyItems = [
    {
      label: "About Us",
      href: "/about",
      hasArrow: true,
    },
    {
      label: "Support",
      href: "/support",
      hasArrow: true,
    },
    {
      label: "Terms of Service",
      href: "/terms",
      hasArrow: true,
    },
    {
      label: "Blog",
      href: "/blog",
      hasArrow: false,
      badge: "Coming Soon",
      external: true,
    },
    {
      label: "Weddings",
      href: "/weddings",
      hasArrow: false,
      badge: "Coming Soon",
      external: true,
    },
  ];

  return (
    <div className="px-6 pb-20">
      {/* Account Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
        <div className="space-y-1">
          {accountItems.map((item) => (
            <MenuItem key={item.label} item={item} />
          ))}
        </div>
      </section>

      {/* Ebunly Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ebunly</h2>
        <div className="space-y-1">
          {ebunlyItems.map((item) => (
            <MenuItem key={item.label} item={item} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 mt-12">
        ©Ebunly2025
      </footer>
    </div>
  );
};

const MenuItem = ({ item }) => {
  const content = (
    <div className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg transition-colors group">
      <div className="flex items-center gap-2">
        <span className="text-base text-gray-900">{item.label}</span>
        {item.external && <ExternalLink className="w-4 h-4 text-gray-400" />}
        {item.badge && (
          <span className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-200 rounded">
            {item.badge}
          </span>
        )}
      </div>
      {item.hasArrow && (
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      )}
    </div>
  );

  if (item.badge) {
    return <div className="cursor-not-allowed opacity-60">{content}</div>;
  }

  return (
    <Link href={item.href} className="block">
      {content}
    </Link>
  );
};

export default ProfileMenu;
