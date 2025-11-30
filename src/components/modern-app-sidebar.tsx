"use client"

import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModernSidebar } from './modern-sidebar';
import { MobileNavbar } from './mobile-navbar';

interface ModernAppSidebarProps {
  currentPath?: string;
  children?: React.ReactNode;
  backgroundGradient?: string;
}

const getDefaultBackground = (path?: string) => {
  switch (path) {
    case '/about':
      return 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 dark:from-purple-900 dark:via-pink-900 dark:to-rose-900';
    case '/models':
      return 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900';
    case '/documentation':
      return 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 dark:from-orange-900 dark:via-amber-900 dark:to-yellow-900';
    case '/blog/posts':
      return 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 dark:from-violet-900 dark:via-purple-900 dark:to-fuchsia-900';
    default:
      return 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900';
  }
};

export function ModernAppSidebar({ currentPath, children, backgroundGradient }: ModernAppSidebarProps) {
  const isMobile = useIsMobile();
  const bgClass = backgroundGradient || getDefaultBackground(currentPath);

  return (
    <>
      {/* Mobile Layout - Hidden on desktop */}
      <div className="min-h-screen flex flex-col md:hidden">
        <MobileNavbar currentPath={currentPath} />
        <div className={`flex-1 ${bgClass}`}>
          {children}
        </div>
      </div>

      {/* Desktop Layout - Hidden on mobile */}
      <div className="min-h-screen hidden md:flex">
        <ModernSidebar currentPath={currentPath} />
        <div className={`flex-1 overflow-hidden ${bgClass}`}>
          {children}
        </div>
      </div>
    </>
  );
}
