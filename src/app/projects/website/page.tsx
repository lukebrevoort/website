'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  ExternalLink, 
  Github, 
  Palette, 
  Code2, 
  Sparkles, 
  Layers, 
  Zap,
  Brain,
  Monitor,
  Globe,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Star,
  Rocket,
  Settings,
  BarChart3,
  FileText,
  Bot,
  Github as GithubIcon,
  Server,
  Database,
  Layout,
  Wand2,
  Target,
  TrendingUp
} from 'lucide-react'
import ProjectSidebar from '@/components/project-sidebar'
import { getProjectBySlug } from '@/data/projects'

export default function WebsitePage() {
  const [activeItem, setActiveItem] = useState('#overview')
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const project = getProjectBySlug('website')
  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Features', href: '#features' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Technology', href: '#technology' },
    { name: 'Innovation', href: '#innovation' },
    { name: 'Impact', href: '#impact' },
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
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div 
              className="mb-16"
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}
            >
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-semibold text-blue-800 mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Student Digital Portfolio
                </motion.div>
                
                <motion.h1 
                  className="text-6xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Personal Website
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  A modern, full-stack digital portfolio showcasing cutting-edge web development 
                  with AI integration, automated content generation, and enterprise-grade performance.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-wrap justify-center gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  {...scaleOnHover}
                >
                  <Github className="h-5 w-5 mr-2" />
                  View Source Code
                </motion.a>
                
                <motion.a
                  href="https://website-nu-tawny-11.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  {...scaleOnHover}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Visit Live Site
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Overview Section */}
            <AnimatedSection id="overview">
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Professional Digital Presence
                  </h2>
                  <div className="prose prose-lg text-gray-700">
                    <p className="mb-4">
                      This personal website represents the pinnacle of modern web development, 
                      combining <strong>Next.js 15 with React 19</strong> for unparalleled performance 
                      and <strong>AI-powered features</strong> that set it apart from traditional portfolios.
                    </p>
                    <p className="mb-4">
                      Built with enterprise-grade technologies and forward-thinking integrations, 
                      it serves as both a professional showcase and a testament to technical expertise 
                      in contemporary web development.
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold">
                      <Rocket className="h-5 w-5 mr-2" />
                      Cutting-Edge Technology Stack
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  animate={{
                    y: [0, -10, 0],
                    transition: {
                      duration: 3,
                      repeat: Infinity
                    }
                  }}
                >
                    <div className="relative">
                    <img 
                      src="/images/personalWebsiteUI.png" 
                      alt="Personal Website UI Screenshot"
                      className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                    <div className="absolute -top-4 -right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg">
                      <Globe className="h-6 w-6" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Features Section */}
            <AnimatedSection id="features">
              <motion.div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Advanced Features & Capabilities
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Every feature is engineered for performance, scalability, and exceptional user experience
                </p>
              </motion.div>

              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    icon: Brain,
                    title: "AI-Powered Features",
                    description: "Client-side machine learning with @mlc-ai/web-llm for intelligent content interactions and personalized experiences.",
                    gradient: "from-purple-500 to-indigo-500"
                  },
                  {
                    icon: GithubIcon,
                    title: "Dynamic GitHub Integration",
                    description: "Real-time Github Actions for Automated Serverless Workflows for Blog Posts",
                    gradient: "from-gray-600 to-gray-800"
                  },
                  {
                    icon: FileText,
                    title: "Automated Content Pipeline",
                    description: "Notion-to-Markdown automation for effortless blog generation and content management workflows.",
                    gradient: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: Zap,
                    title: "Performance Optimized",
                    description: "Server-side rendering with Next.js 15 and React 19 for lightning-fast load times and SEO excellence.",
                    gradient: "from-yellow-500 to-orange-500"
                  },
                  {
                    icon: Palette,
                    title: "Modern Design System",
                    description: "Comprehensive UI library built on Radix primitives with Tailwind CSS and Framer Motion animations.",
                    gradient: "from-pink-500 to-rose-500"
                  },
                  {
                    icon: BarChart3,
                    title: "Analytics & Monitoring",
                    description: "Vercel deployment with performance monitoring, blob storage, and comprehensive analytics tracking.",
                    gradient: "from-blue-500 to-cyan-500"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="group"
                    variants={fadeInUpVariants}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>

            {/* Architecture Section */}
            <AnimatedSection id="architecture">
              <motion.div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Enterprise-Grade Architecture
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Built with scalability, maintainability, and performance as core principles
                </p>
              </motion.div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
                <motion.div 
                  className="grid lg:grid-cols-3 gap-8"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      title: "Full-Stack Framework",
                      description: "Next.js 15 with App Router for optimal performance and SEO",
                      icon: Layout,
                      color: "blue"
                    },
                    {
                      title: "Type-Safe Development",
                      description: "TypeScript throughout for maintainable, error-free code",
                      icon: Settings,
                      color: "green"
                    },
                    {
                      title: "Modern Deployment",
                      description: "Vercel platform with edge functions and global CDN",
                      icon: Server,
                      color: "purple"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="text-center"
                      variants={fadeInUpVariants}
                    >
                      <div className={`inline-flex items-center justify-center w-20 h-20 bg-${item.color}-100 text-${item.color}-600 rounded-2xl mb-6 mx-auto`}>
                        <item.icon className="h-10 w-10" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Technology Stack Section */}
            <AnimatedSection id="technology">
              <motion.div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Cutting-Edge Technology Stack
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Leveraging the latest technologies for optimal development experience and performance
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-12">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-6">
                      <Monitor className="h-8 w-8 text-blue-500 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">Frontend Technologies</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: "Next.js 15", desc: "Latest React framework with App Router", level: 100 },
                        { name: "React 19", desc: "Concurrent features & Server Components", level: 95 },
                        { name: "TypeScript", desc: "Type-safe development", level: 98 },
                        { name: "Tailwind CSS", desc: "Utility-first styling framework", level: 92 },
                        { name: "Framer Motion", desc: "Professional animations", level: 88 }
                      ].map((tech, index) => (
                        <motion.div 
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg"
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-semibold text-gray-900">{tech.name}</div>
                              <div className="text-sm text-gray-600">{tech.desc}</div>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
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
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-6">
                      <Database className="h-8 w-8 text-purple-500 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">Backend & Integrations</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: "@mlc-ai/web-llm", desc: "Client-side machine learning", level: 85 },
                        { name: "GitHub API", desc: "Dynamic repository integration", level: 90 },
                        { name: "Notion API", desc: "Automated content pipeline", level: 88 },
                        { name: "Vercel Platform", desc: "Edge deployment & monitoring", level: 95 },
                        { name: "Radix UI", desc: "Accessible component primitives", level: 92 }
                      ].map((tech, index) => (
                        <motion.div 
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg"
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-semibold text-gray-900">{tech.name}</div>
                              <div className="text-sm text-gray-600">{tech.desc}</div>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
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

            {/* Innovation Section */}
            <AnimatedSection id="innovation">
              <motion.div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Innovation & Developer Experience
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Forward-thinking approach to web development with automated workflows and AI integration
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  {[
                    {
                      icon: Wand2,
                      title: "Automated Build Scripts",
                      description: "Custom automation for blog post generation and content pipeline management"
                    },
                    {
                      icon: Target,
                      title: "AI-First Approach",
                      description: "Integration of machine learning capabilities directly in the browser for enhanced user interactions"
                    },
                    {
                      icon: TrendingUp,
                      title: "Performance Excellence",
                      description: "Optimized for Core Web Vitals with comprehensive monitoring and analytics"
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
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
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
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <Code2 className="h-8 w-8 text-blue-500 mb-3" />
                        <div className="text-sm font-semibold text-gray-800">Modern Tooling</div>
                        <div className="text-xs text-gray-600">ESLint, PostCSS, TypeScript</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <Sparkles className="h-8 w-8 text-purple-500 mb-3" />
                        <div className="text-sm font-semibold text-gray-800">AI Integration</div>
                        <div className="text-xs text-gray-600">Client-side ML capabilities</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <Layers className="h-8 w-8 text-green-500 mb-3" />
                        <div className="text-sm font-semibold text-gray-800">Component Library</div>
                        <div className="text-xs text-gray-600">Radix UI primitives</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <Globe className="h-8 w-8 text-indigo-500 mb-3" />
                        <div className="text-sm font-semibold text-gray-800">Global Deployment</div>
                        <div className="text-xs text-gray-600">Vercel edge network</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Impact Section */}
            <AnimatedSection id="impact">
              <motion.div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Professional Impact & Recognition
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  A testament to software craftsmanship and forward-thinking web development
                </p>
              </motion.div>

              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
                <motion.div 
                  className="grid md:grid-cols-3 gap-8 text-center"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      icon: Rocket,
                      title: "Technical Excellence",
                      description: "Demonstrates mastery of modern web development and emerging technologies"
                    },
                    {
                      icon: Brain,
                      title: "Innovation Leadership",
                      description: "Pioneering AI integration and automated content generation in personal portfolios"
                    },
                    {
                      icon: Target,
                      title: "Professional Platform",
                      description: "Serves as a dynamic showcase for technical skills and project achievements"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUpVariants}
                      className="text-center"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                        <item.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-white/90">{item.description}</p>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="mt-12 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-xl font-semibold mb-6">
                    Experience the future of digital portfolios
                  </p>
                  <motion.a
                    href="https://luke.brevoort.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Visit Live Website
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
      className="mb-24"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  )
}