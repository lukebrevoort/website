'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  ExternalLink, 
  Github, 
  RefreshCw, 
  BookOpen, 
  Bell, 
  Calendar,
  Zap,
  Brain,
  Monitor,
  Database,
  Settings,
  ArrowRight,
  CheckCircle,
  Clock,
  Workflow,
  Target,
  BarChart3,
  GitBranch,
  Layers,
  Cloud,
  Shield,
  Timer,
  TrendingUp,
  FileText,
  Filter,
  Gauge,
  Link2
} from 'lucide-react'
import ProjectSidebar from '@/components/project-sidebar'
import { getProjectBySlug } from '@/data/projects'

export default function CanvasNotionPage() {
  const [activeItem, setActiveItem] = useState('#overview')
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const project = getProjectBySlug('canvas-notion')
  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Solution', href: '#solution' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Technology', href: '#technology' },
    { name: 'Impact', href: '#impact' },
    { name: 'Results', href: '#results' },
  ]

  const handleItemClick = (href: string) => {
    setActiveItem(href)
  }

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const scaleOnHover = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.98 }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50">
      <ProjectSidebar
        projectName={project.title}
        projectLogo={project.logo}
        primaryColor={project.primaryColor}
        secondaryColor={project.secondaryColor}
        navigation={navigation}
        activeItem={activeItem}
        onItemClick={handleItemClick}
      >
        <main className="py-10">
          <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div 
              className="mb-8 sm:mb-12 md:mb-16"
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}
            >
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-gray-100 rounded-full text-sm font-semibold text-red-800 mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Workflow className="h-4 w-4 mr-2" />
                  Academic Workflow Automation
                </motion.div>
                
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 bg-gradient-to-r from-red-600 to-gray-900 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Canvas ↔ Notion
                </motion.h1>
                
                <motion.p 
                  className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  A sophisticated automation bridge that transforms academic workflow management by 
                  seamlessly synchronizing Canvas LMS with Notion for intelligent assignment tracking.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                  {...scaleOnHover}
                >
                  <Github className="h-5 w-5 mr-2" />
                  View Source Code
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Overview Section */}
            <AnimatedSection id="overview">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center mb-8 sm:mb-12 md:mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Bridging Academic Platforms
                  </h2>
                  <div className="prose prose-sm sm:prose-lg text-gray-700">
                    <p className="mb-4">
                      Traditional student workflow management involves juggling multiple platforms, 
                      leading to <strong>missed deadlines and poor prioritization</strong>. This Python-based 
                      automation eliminates friction by creating an intelligent, centralized tracking system.
                    </p>
                    <p className="mb-4">
                      Built with robust API integrations, smart retry mechanisms, and algorithmic 
                      prioritization, it transforms academic chaos into organized productivity.
                    </p>
                    <div className="flex items-center text-red-600 font-semibold">
                      <Target className="h-5 w-5 mr-2" />
                      Real-time Synchronization & Smart Prioritization
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="relative bg-gradient-to-br from-red-100 to-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
                    <div className="flex items-center justify-center space-x-4 sm:space-x-6 md:space-x-8">
                      {/* Canvas Side */}
                      <div className="text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-red-500 rounded-2xl flex items-center justify-center text-white mb-2 sm:mb-4 shadow-lg">
                          <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Canvas LMS</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Assignments & Grades</p>
                      </div>
                      
                      {/* Sync Arrow */}
                        <motion.div
                        className="flex items-center"
                        animate={{ 
                          x: [0, 10, 0],
                          transition: { duration: 2, repeat: Infinity }
                        }}
                        >
                        <div className="flex flex-col items-center space-y-2">
                          <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 animate-spin" />
                          <RefreshCw className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700 animate-spin" />
                        </div>
                        </motion.div>
                      
                      {/* Notion Side */}
                      <div className="text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-2 sm:mb-4 shadow-lg">
                          <FileText className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Notion</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Smart Dashboard</p>
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-full shadow-lg">
                      <Zap className="h-6 w-6" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Solution Section */}
            <AnimatedSection id="solution">
              <motion.div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Intelligent Automation Solution
                </h2>
                <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  Comprehensive features designed to eliminate academic workflow friction
                </p>
              </motion.div>

              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    icon: RefreshCw,
                    title: "Real-time Synchronization",
                    description: "Robust API integrations with Canvas LMS and Notion featuring intelligent retry mechanisms and comprehensive error handling.",
                    gradient: "from-red-500 to-red-600"
                  },
                  {
                    icon: Brain,
                    title: "Smart Prioritization",
                    description: "Algorithmic assignment of priority levels based on assignment weights, due dates, and submission requirements.",
                    gradient: "from-gray-700 to-gray-900"
                  },
                  {
                    icon: Settings,
                    title: "Cross-Platform Automation",
                    description: "Background service with macOS LaunchAgent integration for seamless, continuous operation without user intervention.",
                    gradient: "from-red-600 to-gray-700"
                  },
                  {
                    icon: Database,
                    title: "Relational Database Design",
                    description: "Structured Notion databases with proper normalization, foreign key relationships, and optimized data modeling.",
                    gradient: "from-gray-600 to-gray-800"
                  },
                  {
                    icon: BarChart3,
                    title: "Grade Integration",
                    description: "Automatic grade tracking and submission status updates with comprehensive academic performance analytics.",
                    gradient: "from-red-500 to-gray-600"
                  },
                  {
                    icon: Filter,
                    title: "Intelligent Views",
                    description: "Dynamic filtering and view creation for optimal workflow with customizable academic dashboard layouts.",
                    gradient: "from-gray-700 to-red-600"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="group"
                    variants={fadeInUpVariants}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                      <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r ${feature.gradient} rounded-xl text-white mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">{feature.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>

            {/* Architecture Section */}
            <AnimatedSection id="architecture">
              <motion.div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Robust System Architecture
                </h2>
                <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  Enterprise-grade design patterns for reliability, scalability, and maintainability
                </p>
              </motion.div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12">
                <motion.div 
                  className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      title: "API Integration Layer",
                      description: "Sophisticated REST API clients with rate limiting, authentication, and error recovery",
                      icon: Link2,
                      color: "red"
                    },
                    {
                      title: "Background Processing",
                      description: "Asynchronous task scheduling with macOS LaunchAgent for reliable automation",
                      icon: Cloud,
                      color: "gray"
                    },
                    {
                      title: "Data Modeling",
                      description: "Normalized relational structures optimized for academic workflow patterns",
                      icon: Layers,
                      color: "red"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="text-center"
                      variants={fadeInUpVariants}
                    >
                      <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-${item.color}-100 text-${item.color}-600 rounded-2xl mb-3 sm:mb-4 md:mb-6 mx-auto`}>
                        <item.icon className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{item.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Technology Stack Section */}
            <AnimatedSection id="technology">
              <motion.div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Technology Stack & Tools
                </h2>
                <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  Modern Python ecosystem with enterprise-grade API integrations
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <Monitor className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mr-2 sm:mr-3" />
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Core Technologies</h3>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { name: "Python 3.8+", desc: "Modern async/await patterns", level: 95 },
                        { name: "Canvas LMS API", desc: "Educational data integration", level: 90 },
                        { name: "Notion API", desc: "Workspace automation", level: 88 },
                        { name: "JSON Processing", desc: "Data transformation pipelines", level: 92 },
                        { name: "Timezone Management", desc: "Cross-platform compatibility", level: 85 }
                      ].map((tech, index) => (
                        <motion.div 
                          key={index}
                          className="p-3 sm:p-4 bg-gray-50 rounded-lg"
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-semibold text-gray-900 text-sm sm:text-base">{tech.name}</div>
                              <div className="text-xs sm:text-sm text-gray-600">{tech.desc}</div>
                            </div>
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div 
                              className="bg-gradient-to-r from-red-500 to-gray-700 h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${tech.level}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 mr-2 sm:mr-3" />
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Automation & DevOps</h3>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { name: "macOS LaunchAgent", desc: "System-level service management", level: 90 },
                        { name: "Error Handling", desc: "Comprehensive logging systems", level: 95 },
                        { name: "Retry Mechanisms", desc: "Fault-tolerant API calls", level: 88 },
                        { name: "Configuration Management", desc: "Flexible setup options", level: 85 },
                        { name: "Process Monitoring", desc: "Health checks & diagnostics", level: 82 }
                      ].map((tech, index) => (
                        <motion.div 
                          key={index}
                          className="p-3 sm:p-4 bg-gray-50 rounded-lg"
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-semibold text-gray-900 text-sm sm:text-base">{tech.name}</div>
                              <div className="text-xs sm:text-sm text-gray-600">{tech.desc}</div>
                            </div>
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div 
                              className="bg-gradient-to-r from-gray-700 to-red-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${tech.level}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Impact Section */}
            <AnimatedSection id="impact">
              <motion.div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Real-World Impact & Value
                </h2>
                <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  Demonstrating ability to identify problems and architect comprehensive automation solutions
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
                <motion.div
                  className="space-y-4 sm:space-y-6 md:space-y-8"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  {[
                    {
                      icon: Timer,
                      title: "Cognitive Load Reduction",
                      description: "Eliminates manual tracking across platforms, reducing mental overhead and decision fatigue"
                    },
                    {
                      icon: TrendingUp,
                      title: "Academic Performance",
                      description: "Intelligent prioritization leads to better time management and improved assignment completion rates"
                    },
                    {
                      icon: Shield,
                      title: "Reliability & Trust",
                      description: "Comprehensive error handling ensures consistent operation without user intervention"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-gray-700 rounded-xl flex items-center justify-center text-white">
                        <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{item.title}</h3>
                        <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-red-100 to-gray-100 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg">
                        <GitBranch className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mb-2 sm:mb-3" />
                        <div className="text-xs sm:text-sm font-semibold text-gray-800">API Integration</div>
                        <div className="text-[10px] sm:text-xs text-gray-600">Canvas ↔ Notion sync</div>
                      </div>
                      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg">
                        <Gauge className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 mb-2 sm:mb-3" />
                        <div className="text-xs sm:text-sm font-semibold text-gray-800">Smart Priority</div>
                        <div className="text-[10px] sm:text-xs text-gray-600">Weight-based sorting</div>
                      </div>
                      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg">
                        <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mb-2 sm:mb-3" />
                        <div className="text-xs sm:text-sm font-semibold text-gray-800">Real-time Sync</div>
                        <div className="text-[10px] sm:text-xs text-gray-600">Background automation</div>
                      </div>
                      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg">
                        <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 mb-2 sm:mb-3" />
                        <div className="text-xs sm:text-sm font-semibold text-gray-800">Error Recovery</div>
                        <div className="text-[10px] sm:text-xs text-gray-600">Intelligent retries</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Results Section */}
            <AnimatedSection id="results">
              <motion.div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Technical Excellence & Results
                </h2>
                <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  A showcase of full-stack development skills and thoughtful automation design
                </p>
              </motion.div>

              <div className="bg-gradient-to-br from-red-600 to-gray-900 rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 text-white">
                <motion.div 
                  className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      icon: Workflow,
                      title: "System Integration",
                      description: "Seamless bridging of educational platforms with enterprise-grade reliability"
                    },
                    {
                      icon: Brain,
                      title: "Problem Solving",
                      description: "Identified real-world academic pain points and delivered comprehensive solutions"
                    },
                    {
                      icon: Target,
                      title: "User-Focused Design",
                      description: "Prioritized automation and user experience to eliminate workflow friction"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUpVariants}
                      className="text-center"
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl mb-3 sm:mb-4 md:mb-6">
                        <item.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{item.title}</h3>
                      <p className="text-sm sm:text-base text-white/90">{item.description}</p>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="mt-8 sm:mt-10 md:mt-12 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6">
                    Experience intelligent academic workflow automation
                  </p>
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white text-red-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore the Code
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </motion.a>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </main>
      </ProjectSidebar>
    </div>
  )
}

// Custom component for animated sections
function AnimatedSection({ 
  id, 
  children 
}: { 
  id: string
  children: React.ReactNode 
}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.section
      ref={ref}
      id={id}
      className="mb-12 sm:mb-16 md:mb-24"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.section>
  )
}
