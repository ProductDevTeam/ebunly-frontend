import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";

const TABS = [
  { key: "personal", label: "Personal" },
  { key: "group", label: "Group" },
];

export default function DesktopHeader({ value = "personal", onChange }) {
  return (
    <header className="hidden lg:flex h-14 items-center border-b border-gray-50 bg-white px-16">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Image
          src="/logo.svg"
          alt="CraftBasket logo"
          width={100}
          height={32}
          priority
        />
      </div>

      {/* Center: Tabs */}
      <div className="mx-auto relative flex rounded-full p-1">
        {TABS.map((tab) => {
          const isActive = value === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onChange?.(tab.key)}
              className={clsx(
                "relative z-10 px-4 py-2 text-sm font-semibold rounded-full transition-colors font-sans",
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}

              {isActive && (
                <motion.div
                  layoutId="desktop-tab-indicator"
                  className="absolute inset-0 -z-10 rounded-full bg-orange-50"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.35,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right: reserved for future actions */}
      <div className="w-35" />
    </header>
  );
}
