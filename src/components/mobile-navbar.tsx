"use client"

import React, { useState } from 'react';
import dynamic from "next/dynamic";

const User = dynamic(() => import("lucide-react").then(mod => mod.User), { ssr: false });
const FileText = dynamic(() => import("lucide-react").then(mod => mod.FileText), { ssr: false });
const Wrench = dynamic(() => import("lucide-react").then(mod => mod.Wrench), { ssr: false });
const Newspaper = dynamic(() => import("lucide-react").then(mod => mod.Newspaper), { ssr: false });
const BarChart3 = dynamic(() => import("lucide-react").then(mod => mod.BarChart3), { ssr: false });
const MessageSquare = dynamic(() => import("lucide-react").then(mod => mod.MessageSquare), { ssr: false });
const Globe = dynamic(() => import("lucide-react").then(mod => mod.Globe), { ssr: false });
const Menu = dynamic(() => import("lucide-react").then(mod => mod.Menu), { ssr: false });
const X = dynamic(() => import("lucide-react").then(mod => mod.X), { ssr: false });
const ChevronDown = dynamic(() => import("lucide-react").then(mod => mod.ChevronDown), { ssr: false });
const Bot = dynamic(() => import("lucide-react").then(mod => mod.Bot), { ssr: false });
const BookOpen = dynamic(() => import("lucide-react").then(mod => mod.BookOpen), { ssr: false });
const NotebookPen = dynamic(() => import("lucide-react").then(mod => mod.NotebookPen), { ssr: false });
const BookText = dynamic(() => import("lucide-react").then(mod => mod.BookText), { ssr: false });
const PieChart = dynamic(() => import("lucide-react").then(mod => mod.PieChart), { ssr: false });
const LaptopMinimalCheck = dynamic(() => import("lucide-react").then(mod => mod.LaptopMinimalCheck), { ssr: false });
const SquareTerminal = dynamic(() => import("lucide-react").then(mod => mod.SquareTerminal), { ssr: false });
const MoreHorizontal = dynamic(() => import("lucide-react").then(mod => mod.MoreHorizontal), { ssr: false });

import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Sheet, SheetTrigger, SheetTitle, SheetPortal, SheetOverlay } from './ui/sheet';
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

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

interface MobileNavbarProps {
  currentPath?: string;
}

export function MobileNavbar({ currentPath = "/dashboard" }: MobileNavbarProps) {
  const [activeItem, setActiveItem] = useState(currentPath);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 px-4 py-3 shadow-2xl shadow-black/5"
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

      <div className="flex items-center justify-between relative">
        {/* Logo/Brand Section for mobile */}
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative w-10 h-10 p-0 bg-gradient-to-br from-pink-300/20 to-rose-300/20 backdrop-blur-sm text-white/80 hover:text-white hover:bg-transparent border-0"
            onClick={() => window.location.href = "/dashboard"}
          >
            <Avatar className="h-8 w-8 ring-2 ring-white/20">
              <AvatarImage src="/images/avatar.jpg" alt="Luke Brevoort" />
              <AvatarFallback className="bg-gradient-to-br from-pink-300/20 to-rose-300/20 text-white backdrop-blur-sm">
                LB
              </AvatarFallback>
            </Avatar>
          </Button>
          <div className="flex flex-col">
            <span className="text-white/90 text-sm font-medium">Luke Brevoort</span>
            <span className="text-white/60 text-xs">Developer</span>
          </div>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <div className="relative group">
              {/* Glistening background for menu button */}
              <div className="absolute inset-0 rounded-full bg-transparent group-hover:bg-gradient-to-r group-hover:from-white/10 group-hover:to-white/5 group-hover:backdrop-blur-sm transition-all duration-300" />
              
              {/* Hover shimmer effect */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
                <div 
                  className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  }}
                />
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                className="relative w-10 h-10 p-0 bg-gradient-to-br from-pink-600/20 to-rose-400/20 backdrop-blur-sm text-white/80 hover:text-white hover:bg-transparent border-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </SheetTrigger>
          
          <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content
              className={cn(
                "fixed z-50 gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
                "inset-y-0 right-0 h-full w-80 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
                "p-0 border-0"
              )}
              style={{
                background: 'linear-gradient(135deg, rgba(236, 179, 201, 0.08), rgba(219, 148, 195, 0.17), rgba(199, 149, 185, 0.05))',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
            {/* Sheet Shimmer overlay */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                animation: 'shimmer 4s infinite',
              }}
            />

            {/* Header */}
            <div className="p-6 border-b border-white/10 relative">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 ring-2 ring-white/20">
                    <AvatarImage src="/images/avatar.jpg" alt="Luke Brevoort" />
                    <AvatarFallback className="bg-gradient-to-br from-pink-300/20 to-rose-300/20 text-white backdrop-blur-sm">
                      LB
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-white/90 font-medium">Luke Brevoort</span>
                    <span className="text-white/60 text-xs">Developer</span>
                  </div>
                </div>
                
                {/* Close Button */}
                <div className="relative group">
                  <div className="absolute inset-0 rounded-full bg-transparent group-hover:bg-gradient-to-r group-hover:from-white/10 group-hover:to-white/5 group-hover:backdrop-blur-sm transition-all duration-300" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative w-8 h-8 p-0 bg-transparent hover:bg-transparent text-white/60 hover:text-white border-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="py-4 relative">
              {navSections.map((section, sectionIndex) => (
                <div key={section.title} className="mb-6">
                  <div className="px-6 mb-2">
                    <h3 className="text-xs uppercase tracking-wider text-white/50 font-medium">
                      {section.title}
                    </h3>
                  </div>
                  <nav className="space-y-1 px-4">
                    {section.items.map((item) => {
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
                              ? 'bg-gradient-to-r from-pink-300/20 to-rose-300/20 backdrop-blur-sm shadow-lg shadow-pink-300/10' 
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
                            className={`relative w-full justify-start h-10 px-3 transition-all duration-300 border-0 bg-transparent hover:bg-transparent text-white/80 hover:text-white ${
                              isActive ? 'text-white' : ''
                            }`}
                            onClick={() => {
                              setActiveItem(item.href);
                              setIsOpen(false);
                              window.location.href = item.href;
                            }}
                          >
                            <Icon className={`h-4 w-4 mr-3 transition-all duration-300 ${
                              isActive ? 'text-pink-300 drop-shadow-[0_0_8px_rgba(236,179,201,0.5)]' : 'group-hover:text-pink-300'
                            }`} />
                            <span className="flex-1 text-left">{item.title}</span>
                            {item.badge && (
                              <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-white/20 text-white/90 backdrop-blur-sm ml-2">
                                {item.badge}
                              </Badge>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 relative">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>v2.1.0</span>
                <Badge variant="outline" className="text-xs bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-white/20 text-white/80 backdrop-blur-sm">
                  Beta
                </Badge>
              </div>
            </div>
            </SheetPrimitive.Content>
          </SheetPortal>
        </Sheet>
      </div>
    </div>
  );
}
