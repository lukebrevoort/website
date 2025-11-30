"use client";

import React, { useState } from 'react';
import { projects, getFeaturedProjects } from '@/data/projects';

import {
  User,
  Globe,
  Menu,
  X,
  Bot,
  BookOpen,
  NotebookPen,
  BookText,
  LaptopMinimalCheck,
  SquareTerminal,
  MoreHorizontal,
  Activity,
  Brain,
  TrendingUp,
  FileUser
} from 'lucide-react';

import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Sheet, SheetTrigger, SheetTitle, SheetPortal, SheetOverlay } from './ui/sheet';
import * as SheetPrimitive from "@radix-ui/react-dialog";


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

const getProjectIcon = (slug: string): React.ComponentType<{ className?: string }> => {
  switch (slug) {
    case 'canvas-notion':
      return BookText;
    case 'sentiment':
      return Brain;
    case 'website':
      return LaptopMinimalCheck;
    case 'calculator':
      return SquareTerminal;
    case 'flowstate':
      return Activity;
    case 'hftc':
      return TrendingUp;
    case 'job-personalizer':
      return FileUser;
    default:
      return Globe;
  }
};

const generateProjectNavItems = (): NavItem[] => {
  const featuredProjects = getFeaturedProjects();
  const projectItems: NavItem[] = featuredProjects.map(project => ({
    title: project.title,
    icon: getProjectIcon(project.slug),
    href: `/projects/${project.slug}`,
    badge: project.status === 'in-progress' ? 'WIP' : undefined
  }));

  if (projects.length > featuredProjects.length) {
    projectItems.push({
      title: "More Projects",
      icon: MoreHorizontal,
      href: "/projects"
    });
  }

  return projectItems;
};

const projectNavItems = generateProjectNavItems();

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
    items: projectNavItems
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
      className="sticky top-0 z-50 bg-sidebar text-sidebar-foreground border-b border-sidebar-border px-4 py-3 shadow-md"
    >
      <div className="flex items-center justify-between relative">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative w-10 h-10 p-0 bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80"
            onClick={() => window.location.href = "/dashboard"}
          >
            <Avatar className="h-8 w-8 ring-2 ring-sidebar-border">
              <AvatarImage src="/images/avatar.jpg" alt="Luke Brevoort" />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground">
                LB
              </AvatarFallback>
            </Avatar>
          </Button>
          <div className="flex flex-col">
            <span className="text-sidebar-foreground text-sm font-medium">Luke Brevoort</span>
            <span className="text-sidebar-foreground/70 text-xs">Developer</span>
          </div>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative w-10 h-10 p-0 bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          
          <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content
              className="fixed z-50 inset-y-0 right-0 w-80 bg-sidebar text-sidebar-foreground border-l border-sidebar-border p-0"
            >
              <div className="p-6 border-b border-sidebar-border">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 ring-2 ring-sidebar-border">
                      <AvatarImage src="/images/avatar.jpg" alt="Luke Brevoort" />
                      <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground">
                        LB
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sidebar-foreground font-medium">Luke Brevoort</span>
                      <span className="text-sidebar-foreground/70 text-xs">Developer</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative w-8 h-8 p-0 bg-transparent text-sidebar-foreground/70 hover:text-sidebar-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="py-4">
                {navSections.map((section) => (
                  <div key={section.title} className="mb-6">
                    <div className="px-6 mb-2">
                      <h3 className="text-xs uppercase tracking-wider text-sidebar-foreground/50 font-medium">
                        {section.title}
                      </h3>
                    </div>
                    <nav className="space-y-1 px-4">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.href;

                        return (
                          <Button
                            key={item.href}
                            variant="ghost"
                            className={`relative w-full justify-start h-10 px-3 text-sidebar-foreground hover:text-sidebar-accent ${
                              isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                            }`}
                            onClick={() => {
                              setActiveItem(item.href);
                              setIsOpen(false);
                              window.location.href = item.href;
                            }}
                          >
                            <Icon className="h-4 w-4 mr-3" />
                            <span className="flex-1 text-left">{item.title}</span>
                            {item.badge && (
                              <Badge variant="outline" className="ml-2">
                                {item.badge}
                              </Badge>
                            )}
                          </Button>
                        );
                      })}
                    </nav>
                  </div>
                ))}
              </div>
            </SheetPrimitive.Content>
          </SheetPortal>
        </Sheet>
      </div>
    </div>
  );
}