'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  ExternalLink, 
  Github, 
  Bot, 
  BookOpen, 
  Palette, 
  Code, 
  MessageSquare, 
  Calendar,
  Zap,
  Brain,
  Monitor,
  Database,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Play,
  Sparkles
} from 'lucide-react'
import ProjectSidebar from '@/components/project-sidebar'
import { getProjectBySlug } from '@/data/projects'

export default function FlowStatePage() {
  const [activeItem, setActiveItem] = useState('#overview')
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const project = getProjectBySlug('flowstate')
  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Features', href: '#features' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Technology', href: '#technology' },
    { name: 'Experience', href: '#experience' },
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
      transition: { duration: 0.6, ease: "easeOut" }
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
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-lime-50">
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
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-lime-100 rounded-full text-sm font-semibold text-orange-800 mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI-Powered Student Platform
                </motion.div>
                
                <motion.h1 
                  className="text-6xl font-black text-gray-900 mb-4 bg-gradient-to-r from-orange-600 to-lime-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  FlowState
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  A revolutionary productivity platform that leverages AI to transform how students manage their academic life. 
                  Built with cutting-edge technology for the next generation of learners.
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
                  href="https://flowstate-self.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-lime-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  {...scaleOnHover}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Live Demo
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
                    Revolutionizing Student Productivity
                  </h2>
                  <div className="prose prose-lg text-gray-700">
                    <p className="mb-4">
                      FlowState represents <strong>"a brand new way of experiencing productivity"</strong> for students. 
                      This comprehensive platform leverages <strong>LangGraph AI orchestration</strong> to create an 
                      intelligent ecosystem of specialized agents.
                    </p>
                    <p className="mb-4">
                      From course material analysis to intelligent study scheduling, FlowState handles the 
                      complexities of academic life while students focus on what matters most - learning.
                    </p>
                    <div className="flex items-center text-orange-600 font-semibold">
                      <Brain className="h-5 w-5 mr-2" />
                      Powered by Advanced AI Workflows
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
                  <div className="relative bg-gradient-to-br from-orange-100 to-lime-100 rounded-2xl p-8 shadow-2xl">
                    <video 
                      src="/images/FSAnimation.mov" 
                      autoPlay 
                      loop 
                      muted 
                      className="w-full rounded-xl shadow-lg"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg">
                      <Play className="h-6 w-6" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Features Section */}
            <AnimatedSection id="features">
              <motion.div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Intelligent Features for Modern Students
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Every feature is designed with AI-first thinking to create seamless, intelligent experiences
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
                    icon: MessageSquare,
                    title: "AI Chat Assistant",
                    description: "Conversational AI interface with real-time streaming responses and intelligent context awareness for academic queries.",
                    gradient: "from-blue-500 to-purple-500"
                  },
                  {
                    icon: BookOpen,
                    title: "Academic Hub",
                    description: "Centralized management for assignments, courses, and schedules with intelligent prioritization algorithms.",
                    gradient: "from-green-500 to-teal-500"
                  },
                  {
                    icon: Brain,
                    title: "Smart Scheduling",
                    description: "AI-powered study scheduling that adapts to your learning patterns and optimizes productivity windows.",
                    gradient: "from-orange-500 to-red-500"
                  },
                  {
                    icon: Zap,
                    title: "Real-time Processing",
                    description: "Instant responses with visual loading indicators and step-by-step processing feedback for transparency.",
                    gradient: "from-yellow-500 to-orange-500"
                  },
                  {
                    icon: Calendar,
                    title: "Intelligent Analytics",
                    description: "Advanced tracking and analytics to understand your productivity patterns and suggest improvements.",
                    gradient: "from-purple-500 to-pink-500"
                  },
                  {
                    icon: Sparkles,
                    title: "Dynamic Content",
                    description: "Custom response sub-agent generates personalized React components for interactive learning experiences.",
                    gradient: "from-indigo-500 to-blue-500"
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
                  Sophisticated AI Architecture
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Built on LangGraph for intelligent agent orchestration and seamless AI workflows
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
                      title: "LangGraph Orchestration",
                      description: "Advanced AI workflow management with specialized agents for different academic tasks",
                      icon: Bot,
                      color: "orange"
                    },
                    {
                      title: "Streaming Capabilities",
                      description: "Real-time response streaming with visual feedback and progressive enhancement",
                      icon: Zap,
                      color: "blue"
                    },
                    {
                      title: "Dynamic React Generation",
                      description: "Custom sub-agents generate personalized React components for interactive experiences",
                      icon: Code,
                      color: "green"
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
                  Modern Technology Stack
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Built with cutting-edge technologies for performance, scalability, and developer experience
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
                      <h3 className="text-2xl font-bold text-gray-900">Frontend</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: "Next.js 14", desc: "React framework with App Router" },
                        { name: "TypeScript", desc: "Type-safe development" },
                        { name: "Tailwind CSS", desc: "Utility-first styling" },
                        { name: "Framer Motion", desc: "Smooth animations" }
                      ].map((tech, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          whileHover={{ x: 5 }}
                        >
                          <div>
                            <div className="font-semibold text-gray-900">{tech.name}</div>
                            <div className="text-sm text-gray-600">{tech.desc}</div>
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-500" />
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
                      <Database className="h-8 w-8 text-orange-500 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">Backend & AI</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: "Python", desc: "AI processing & orchestration" },
                        { name: "LangGraph", desc: "Agent workflow management" },
                        { name: "Streaming APIs", desc: "Real-time data flow" },
                        { name: "Vercel", desc: "Cloud deployment" }
                      ].map((tech, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          whileHover={{ x: 5 }}
                        >
                          <div>
                            <div className="font-semibold text-gray-900">{tech.name}</div>
                            <div className="text-sm text-gray-600">{tech.desc}</div>
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* User Experience Section */}
            <AnimatedSection id="experience">
              <motion.div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Exceptional User Experience
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Every interaction is crafted for elegance, accessibility, and productivity
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
                      icon: Palette,
                      title: "Beautiful Design",
                      description: "Custom Alegreya typography and sophisticated color schemes create an inspiring learning environment"
                    },
                    {
                      icon: Smartphone,
                      title: "Mobile-First",
                      description: "Responsive design ensures seamless productivity across all devices and screen sizes"
                    },
                    {
                      icon: Zap,
                      title: "Instant Feedback",
                      description: "Real-time loading states and progress indicators keep users informed at every step"
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
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-lime-500 rounded-xl flex items-center justify-center text-white">
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
                  <div className="bg-gradient-to-br from-orange-100 to-lime-100 rounded-3xl p-8 shadow-2xl">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <div className="flex-1 text-center text-sm text-gray-500">FlowState Interface</div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                        <div className="h-4 bg-gradient-to-r from-orange-300 to-lime-300 rounded-lg w-1/2"></div>
                        <div className="h-12 bg-gray-100 rounded-lg flex items-center px-4">
                          <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />
                          <div className="h-2 bg-gray-300 rounded w-full"></div>
                        </div>
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
                  Real Impact for Students
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  FlowState demonstrates the power of AI to solve real-world educational challenges
                </p>
              </motion.div>

              <div className="bg-gradient-to-br from-orange-600 to-lime-600 rounded-3xl p-8 md:p-12 text-white">
                <motion.div 
                  className="grid md:grid-cols-3 gap-8 text-center"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      icon: Brain,
                      title: "AI-First Approach",
                      description: "Pioneering the integration of LangGraph for educational productivity"
                    },
                    {
                      icon: Zap,
                      title: "Seamless Integration",
                      description: "Unified platform for all academic management needs"
                    },
                    {
                      icon: ArrowRight,
                      title: "Future-Ready",
                      description: "Scalable architecture ready for expanding AI capabilities"
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
                    Experience the future of student productivity
                  </p>
                  <motion.a
                    href="https://flowstate-self.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-white text-orange-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Try FlowState Now
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