'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ProjectSidebarProps {
  projectName: string
  projectLogo: string
  primaryColor: string
  secondaryColor: string
  navigation: Array<{
    name: string
    href: string
  }>
  activeItem: string
  onItemClick: (href: string) => void
  children?: React.ReactNode
}

export default function ProjectSidebar({
  projectName,
  projectLogo,
  primaryColor,
  secondaryColor,
  navigation,
  activeItem,
  onItemClick,
  children
}: ProjectSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [showActiveState, setShowActiveState] = useState(false)

  // Handle active state visibility timing
  useEffect(() => {
    if (!isCollapsed) {
      // Delay showing active state until sidebar expansion animation completes
      const timer = setTimeout(() => {
        setShowActiveState(true)
      }, 600) // 500ms for expansion + 100ms buffer
      
      return () => clearTimeout(timer)
    } else {
      // Hide active state immediately when collapsing
      setShowActiveState(false)
    }
  }, [isCollapsed])

  // Generate CSS-in-JS gradient styles based on provided colors
  const getGradientStyle = (opacity1: number = 0.3, opacity2: number = 0.4, opacity3: number = 0.25) => ({
    background: `linear-gradient(135deg, ${primaryColor}${Math.round(opacity1 * 255).toString(16).padStart(2, '0')}, ${secondaryColor}${Math.round(opacity2 * 255).toString(16).padStart(2, '0')}, ${primaryColor}${Math.round(opacity3 * 255).toString(16).padStart(2, '0')})`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  })

  const getMobileGradientStyle = () => ({
    background: `linear-gradient(135deg, ${primaryColor}26, ${secondaryColor}33, ${primaryColor}1A)`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  })

  const getLogoBackgroundStyle = () => ({
    background: `linear-gradient(to right, ${primaryColor}4D, ${secondaryColor}4D)`,
  })

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)} 
        />
        <div 
          className={`fixed inset-y-0 left-0 flex w-80 flex-col shadow-2xl transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={getMobileGradientStyle()}
        >
          {/* Mobile shimmer overlay */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
              animation: 'shimmer 4s infinite',
            }}
          />

          {/* Mobile Header */}
          <div className={`p-6 border-b border-white/10 relative transform transition-all duration-300 delay-100 ${sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-white">{projectName}</h2>
              </div>
              
              {/* Close Button */}
              <div className="relative group">
                <div className="absolute inset-0 rounded-full bg-transparent group-hover:bg-gradient-to-r group-hover:from-white/10 group-hover:to-white/5 group-hover:backdrop-blur-sm transition-all duration-300" />
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="relative w-8 h-8 p-0 bg-transparent hover:bg-transparent text-white hover:text-white border-0 rounded-full flex items-center justify-center transition-colors duration-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Back Link */}
          <div className={`px-6 py-4 border-b border-white/10 transform transition-all duration-300 delay-150 ${sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
            <Link 
              href="/projects" 
              className="flex items-center text-sm text-white hover:text-white transition-colors duration-300 group"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-transparent group-hover:bg-gradient-to-r group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300" />
                <ChevronLeft className="relative h-4 w-4 mr-2" />
              </div>
              Back to Projects
            </Link>
          </div>
          
          {/* Mobile Navigation */}
          <nav className={`flex-1 px-4 py-4 space-y-1 transform transition-all duration-300 delay-200 ${sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
            {navigation.map((item, index) => {
              const isActive = activeItem === item.href;
              
              return (
                <div 
                  key={item.href} 
                  className={`relative group transform transition-all duration-300 ${sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                  style={{ transitionDelay: `${250 + index * 50}ms` }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onItemClick(item.href);
                      setSidebarOpen(false);
                      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`relative block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-black/20 to-gray-800/30 backdrop-blur-sm shadow-lg shadow-black/20'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </a>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div 
        className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col shadow-2xl transition-all duration-500 ease-in-out ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        style={getGradientStyle()}
      >
        {/* Desktop shimmer overlay */}
        <div 
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
            animation: 'shimmer 3s infinite',
          }}
        />

        <div className="flex flex-col flex-grow relative">
          {/* Desktop Header */}
          <div className="p-6 border-b border-white/10">
            {!isCollapsed && (
              <div className="opacity-0 animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-bold text-white">{projectName}</span>
                  <Image src={projectLogo} alt={projectName} width={40} height={32} />
                </div>
                <p className="text-sm text-white font-semibold mt-1">Project Navigation</p>
              </div>
            )}
            {isCollapsed && (
              <div className="flex justify-center">
                <div className="w-14 h-12 rounded-lg backdrop-blur-sm flex items-center justify-center" style={getLogoBackgroundStyle()}>
                  <Image src={projectLogo} alt={projectName} width={40} height={32} />
                </div>
              </div>
            )}
          </div>

          {/* Desktop Back Link */}
          <div className="px-6 py-4 border-b border-white/10">
            {!isCollapsed && (
              <Link 
                href="/projects" 
                className="flex items-center text-sm text-white hover:text-white transition-colors duration-300 group opacity-0 animate-fadeIn"
                style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-transparent group-hover:bg-gradient-to-r group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300" />
                  <ChevronLeft className="relative font-semibold h-4 w-4 mr-2" />
                </div>
                Back to Projects
              </Link>
            )}
            {isCollapsed && (
              <div className="flex justify-center">
                <Link 
                  href="/projects" 
                  className="w-8 h-8 flex items-center justify-center text-white hover:text-white transition-colors duration-300 group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-transparent group-hover:bg-gradient-to-r group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300" />
                    <ChevronLeft className="relative h-4 w-4" />
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="flex-grow px-4 py-6">
            <nav className={`space-y-2 ${isCollapsed ? 'px-0' : ''}`}>
              {navigation.map((item, itemIndex) => {
                const isActive = activeItem === item.href;
                
                return (
                  <div key={item.href} className="relative group">
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        onItemClick(item.href);
                        document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`relative flex items-center rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                        isActive && !isCollapsed && showActiveState
                          ? 'text-white bg-gradient-to-r from-black/30 to-gray-800/40 backdrop-blur-sm shadow-lg shadow-black/20'
                          : 'text-white/80 hover:text-white'
                      } ${isCollapsed ? 'px-2 py-3 justify-center' : 'px-4 py-3'}`}
                      style={!isCollapsed ? { animationDelay: `${0.4 + itemIndex * 0.05}s` } : {}}
                    >
                      {isCollapsed && (
                        <div className="w-6 h-6 flex items-center justify-center">
                        </div>
                      )}
                      {!isCollapsed && (
                        <span className="opacity-0 animate-fadeIn" style={{ animationDelay: `${0.5 + itemIndex * 0.05}s`, animationFillMode: 'forwards' }}>
                          {item.name}
                        </span>
                      )}
                    </a>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Desktop Footer */}
          <div className="p-6 border-t border-white/10">
            {!isCollapsed && (
              <div className="text-xs text-white/50 opacity-0 animate-fadeIn" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                {projectName} Project
              </div>
            )}
            {isCollapsed && (
              <div className="flex justify-center">
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile toggle button */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
        <button
          type="button"
          className="text-gray-700"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          {projectName}
        </div>
      </div>

      {/* Main content wrapper */}
      <div className={`transition-all duration-500 ease-in-out ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {children}
      </div>
    </>
  )
}
