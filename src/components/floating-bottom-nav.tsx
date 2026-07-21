"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, User, NotebookPen, FolderKanban, Bot } from "lucide-react";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { icon: Home, href: "/dashboard", label: "Home" },
  { icon: User, href: "/about", label: "About" },
  { icon: NotebookPen, href: "/blog/posts", label: "Blog" },
  { icon: FolderKanban, href: "/projects", label: "Projects" },
  { icon: Bot, href: "/models", label: "Models" },
];

interface FloatingBottomNavProps {
  currentPath?: string;
}

export function FloatingBottomNav({
  currentPath = "/dashboard",
}: FloatingBottomNavProps) {
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return currentPath === "/dashboard" || currentPath === "/";
    }
    return currentPath.startsWith(href);
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300,
        delay: 0.2,
      }}
      className="fixed bottom-4 left-0 right-0 flex flex-col justify-center items-center z-50 md:hidden"
    >
      <div
        className="flex items-center gap-1 px-4 py-3 rounded-full shadow-lg border border-white/20"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <motion.a
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center p-2 rounded-full transition-colors"
              whileTap={{ scale: 0.9 }}
              style={{
                minWidth: "48px",
              }}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    active
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                />
                {/* Active indicator dot */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  active ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </motion.a>
          );
        })}
      </div>
    </motion.nav>
  );
}
