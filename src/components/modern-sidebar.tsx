"use client"

import React, { useState } from 'react';
import dynamic from "next/dynamic";

const User = dynamic(() => import("lucide-react").then(mod => mod.User), { ssr: false });
const Folder = dynamic(() => import("lucide-react").then(mod => mod.Folder), { ssr: false });
const FileText = dynamic(() => import("lucide-react").then(mod => mod.FileText), { ssr: false });
const Wrench = dynamic(() => import("lucide-react").then(mod => mod.Wrench), { ssr: false });
const Newspaper = dynamic(() => import("lucide-react").then(mod => mod.Newspaper), { ssr: false });
const BarChart3 = dynamic(() => import("lucide-react").then(mod => mod.BarChart3), { ssr: false });
const MessageSquare = dynamic(() => import("lucide-react").then(mod => mod.MessageSquare), { ssr: false });
const Globe = dynamic(() => import("lucide-react").then(mod => mod.Globe), { ssr: false });
const ChevronRight = dynamic(() => import("lucide-react").then(mod => mod.ChevronRight), { ssr: false });
const Menu = dynamic(() => import("lucide-react").then(mod => mod.Menu), { ssr: false });
const Bot = dynamic(() => import("lucide-react").then(mod => mod.Bot), { ssr: false });
const BookOpen = dynamic(() => import("lucide-react").then(mod => mod.BookOpen), { ssr: false });
const NotebookPen = dynamic(() => import("lucide-react").then(mod => mod.NotebookPen), { ssr: false });
const BookText = dynamic(() => import("lucide-react").then(mod => mod.BookText), { ssr: false });
const PieChart = dynamic(() => import("lucide-react").then(mod => mod.PieChart), { ssr: false });
const LaptopMinimalCheck = dynamic(() => import("lucide-react").then(mod => mod.LaptopMinimalCheck), { ssr: false });
const SquareTerminal = dynamic(() => import("lucide-react").then(mod => mod.SquareTerminal), { ssr: false });
const MoreHorizontal = dynamic(() => import("lucide-react").then(mod => mod.MoreHorizontal), { ssr: false });
import { Button } from './ui/button';
import { lukesFont } from '@/app/fonts';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Information",
    items: [
      { title: "About Me", icon: User, href: "/about" },
      { title: "Models", icon: Bot, href: "/models" },
      { title: "Documentation", icon: BookOpen, href: "/documentation" },
      { title: "Blog", icon: NotebookPen, href: "/blog/posts", badge: "New" }
    ]
  },
  {
    title: "Projects",
    items: [
      { title: "Assignment Tracker", icon: BookText, href: "/projects/canvas-notion" },
      { title: "Sentiment Analysis", icon: PieChart, href: "/projects/sentiment" },
      { title: "Personal Website", icon: LaptopMinimalCheck, href: "/projects/website" },
      { title: "Calculator", icon: SquareTerminal, href: "/projects/calculator" },
      { title: "More", icon: MoreHorizontal, href: "/projects" }
    ]
  }
];

interface ModernSidebarProps {
  currentPath?: string;
}

export function ModernSidebar({ currentPath = "/dashboard" }: ModernSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeItem, setActiveItem] = useState(currentPath);

  return (
    <div 
      className={`sticky top-0 h-screen backdrop-blur-xl bg-white/10 border-r border-white/20 transition-all duration-500 ease-in-out flex flex-col shadow-2xl shadow-black/5 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Shimmer overlay */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
          animation: 'shimmer 3s infinite',
        }}
      />

      {/* Header */}
      <div className="p-4 border-b border-white/10 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`relative p-0 bg-transparent hover:bg-white/10 border-0 transition-all duration-300 ${
                isCollapsed ? 'w-8 h-8' : 'w-8 h-8'
              }`}
              onClick={() => window.location.href = "/dashboard"}
            >
              <Avatar className={`ring-white/20 transition-all duration-300 ${
                isCollapsed ? 'h-6 w-6 ring-1' : 'h-8 w-8 ring-2'
              }`}>
                <AvatarImage src="/images/avatar.jpg" alt="Luke Brevoort" />
                <AvatarFallback className={`bg-transparent text-white transition-all duration-300 ${
                  isCollapsed ? 'text-xs' : ''
                }`}>
                  LB
                </AvatarFallback>
              </Avatar>
            </Button>
            {!isCollapsed && (
              <div className={`flex flex-col opacity-0 animate-fadeIn ${lukesFont.className}`} style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <span className={`text-black-300 text-lg ${lukesFont.className}`}>Luke Brevoort</span>
                <span className={`text-black-300 text-lg ${lukesFont.className}`}>Developer</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {navSections.map((section, sectionIndex) => (
          <div key={section.title} className="mb-6">
            {!isCollapsed && (
              <div className="px-4 mb-2">
                <h3 className="text-sm uppercase tracking-wider text-indigo-400 font-medium opacity-0 animate-fadeIn" style={{ animationDelay: `${0.3 + sectionIndex * 0.1}s`, animationFillMode: 'forwards' }}>
                  {section.title}
                </h3>
              </div>
            )}
            <nav className="space-y-1 px-2">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const isActive = activeItem === item.href;
                
                return (
                  <div
                    key={item.href}
                    className="relative group"
                  >
                    {/* Glistening background for active/hover state */}
                    <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm shadow-lg shadow-blue-500/10' 
                        : 'bg-transparent group-hover:bg-gradient-to-r group-hover:from-white/10 group-hover:to-white/5 group-hover:backdrop-blur-sm'
                    }`} />
                    
                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
                      <div 
                        className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        }}
                      />
                    </div>

                    <Button
                      variant="ghost"
                      className={`relative w-full justify-start h-9 px-3 transition-all duration-300 border-0 bg-transparent hover:bg-transparent ${
                        isActive 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-indigo-400 hover:text-indigo-300'
                      } ${isCollapsed ? 'px-2' : ''}`}
                      onClick={() => {
                        setActiveItem(item.href);
                        window.location.href = item.href;
                      }}
                      style={{ animationDelay: `${0.4 + sectionIndex * 0.1 + itemIndex * 0.05}s` }}
                    >
                      <div className={`${isCollapsed ? 'opacity-0 animate-fadeIn' : ''}`} style={isCollapsed ? { animationDelay: `${0.3 + itemIndex * 0.1}s`, animationFillMode: 'forwards' } : {}}>
                        <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} transition-all duration-300 ${
                          isActive 
                            ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] group-hover:text-blue-300' 
                            : 'text-indigo-400 group-hover:text-indigo-300'
                        }`} />
                      </div>
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between opacity-0 animate-fadeIn" style={{ animationDelay: `${0.5 + itemIndex * 0.05}s`, animationFillMode: 'forwards' }}>
                          <span className="flex-1 text-left">{item.title}</span>
                          <div className="flex items-center space-x-1">
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-white/20 text-white/80 backdrop-blur-sm">
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronRight className={`h-3 w-3 transition-all duration-300 group-hover:translate-x-0.5 ${
                              isActive 
                                ? 'text-blue-400 group-hover:text-blue-300' 
                                : 'text-indigo-400 group-hover:text-indigo-300'
                            }`} />
                          </div>
                        </div>
                      )}
                    </Button>
                  </div>
                );
              })}
            </nav>
            {sectionIndex < navSections.length - 1 && !isCollapsed && (
              <Separator className="mx-4 mt-4 bg-white/10 opacity-0 animate-fadeIn" style={{ animationDelay: `${0.6 + sectionIndex * 0.1}s`, animationFillMode: 'forwards' }} />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10 opacity-0 animate-fadeIn" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>v2.1.0</span>
            <Badge variant="secondary" className="text-xs bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-white/20 text-white/100 backdrop-blur-sm">
              Beta
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
