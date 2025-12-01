'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'
import { 
  ExternalLink, 
  Github, 
  Bot, 
  FileText, 
  Zap, 
  Brain, 
  Search, 
  Target,
  Users,
  Monitor,
  Database,
  Activity,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Layers,
  Code,
  Download,
  Mail,
  Settings,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react'
import ProjectSidebar from '@/components/project-sidebar'
import { getProjectBySlug } from '@/data/projects'

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
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  )
}

// Animated AI processing component
function AIProcessingFlow() {
  return (
    <div className="relative h-48 bg-gradient-to-r from-purple-900 to-pink-900 rounded-xl p-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-purple-200 font-mono text-sm">AI Pipeline</div>
          <div className="text-green-400 font-mono text-sm">97% Match</div>
        </div>
        
        {/* Processing Steps */}
        <div className="flex items-center space-x-4 mb-4">
          {['Scrape', 'Analyze', 'Generate', 'Personalize'].map((step, i) => (
            <motion.div
              key={step}
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold mb-2">
                {i + 1}
              </div>
              <div className="text-xs text-purple-200">{step}</div>
            </motion.div>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-purple-800 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  )
}

export default function JobPersonalizerPage() {
  const [activeItem, setActiveItem] = useState('#overview')
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const project = getProjectBySlug('job-personalizer')
  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Pipeline', href: '#pipeline' },
    { name: 'AI Features', href: '#ai-features' },
    { name: 'Technology', href: '#technology' },
    { name: 'Architecture', href: '#architecture' },
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
      y: 0
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
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
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
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-semibold text-purple-800 mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  AI-Powered Job Automation
                </motion.div>
                
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Job Application Automator
                </motion.h1>
                
                <motion.p 
                  className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  An intelligent Python-based automation platform that transforms job searching with 
                  local AI models, automated scraping, and personalized document generation for 
                  streamlined career development.
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
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 md:mb-6">
                    Intelligent Job Search Automation
                  </h2>
                  <div className="prose prose-lg text-gray-700">
                    <p className="mb-4">
                      This innovative platform demonstrates the intersection of <strong>artificial intelligence, 
                      web automation, and professional career development</strong>. Built with Ollama's local 
                      LLM models including <strong>GPT-OSS 20B and Llama3.2</strong>.
                    </p>
                    <p className="mb-4">
                      The system transforms the traditionally time-consuming job application process into an 
                      intelligent, streamlined workflow that maintains <strong>privacy by processing data locally</strong> 
                      while delivering personalized, professional results.
                    </p>
                    <div className="flex items-center text-purple-600 font-semibold">
                      <Brain className="h-5 w-5 mr-2" />
                      Local AI Processing with Privacy Focus
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
                  <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 shadow-2xl">
                    <AIProcessingFlow />
                    <div className="absolute -top-4 -right-4 bg-purple-500 text-white p-3 rounded-full shadow-lg">
                      <Bot className="h-6 w-6" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Automation Pipeline Section */}
            <AnimatedSection id="pipeline">
              <motion.div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                  End-to-End Automation Pipeline
                </h2>
                <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  Complete workflow from job discovery to application submission with AI-powered personalization
                </p>
              </motion.div>

              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-12"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    icon: Search,
                    title: "Smart Scraping",
                    description: "Automated job posting extraction using Selenium and BeautifulSoup with intelligent parsing",
                    color: "purple"
                  },
                  {
                    icon: Brain,
                    title: "AI Analysis",
                    description: "Local LLM processing for job requirement analysis and fit scoring with privacy protection",
                    color: "pink"
                  },
                  {
                    icon: FileText,
                    title: "Document Generation",
                    description: "Dynamic LaTeX resume personalization and custom cover letter creation for each role",
                    color: "purple"
                  },
                  {
                    icon: Database,
                    title: "Application Tracking",
                    description: "Notion API integration for comprehensive application management and progress monitoring",
                    color: "pink"
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="group text-center"
                    variants={fadeInUpVariants}
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="relative mb-4 sm:mb-6">
                      <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-${step.color}-500 to-${step.color === 'purple' ? 'pink' : 'purple'}-500 rounded-2xl text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                      </div>
                      {index < 3 && (
                        <div className="hidden lg:block absolute top-10 left-full w-full">
                          <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>

            {/* AI Features Section */}
            <AnimatedSection id="ai-features">
              <motion.div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Advanced AI Integration
                </h2>
                <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  Cutting-edge local AI models ensuring privacy while delivering intelligent automation
                </p>
              </motion.div>

              <motion.div 
                className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    icon: Bot,
                    title: "Local LLM Processing",
                    description: "Ollama integration with GPT-OSS 20B and Llama3.2 models for private, intelligent text processing and analysis.",
                    features: ["Privacy-First Processing", "Ollama Integration", "GPT-OSS 20B Model", "Llama3.2 Support"],
                    gradient: "from-purple-500 to-pink-500"
                  },
                  {
                    icon: Target,
                    title: "Intelligent Fit Scoring",
                    description: "AI-powered analysis of job requirements with sophisticated matching algorithms and personalized recommendations.",
                    features: ["Requirement Analysis", "Skill Gap Detection", "Match Scoring", "Optimization Suggestions"],
                    gradient: "from-pink-500 to-purple-500"
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
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">{feature.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                      <div className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>

            {/* Technology Stack Section */}
            <AnimatedSection id="technology">
              <motion.div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Modern Technology Stack
                </h2>
                <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  Built with cutting-edge Python technologies and AI frameworks for robust automation
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
                      <Monitor className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 mr-3" />
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Automation Engine</h3>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { name: "Python 3.10+", desc: "Core automation and processing", level: 95 },
                        { name: "Selenium", desc: "Advanced web scraping capabilities", level: 92 },
                        { name: "BeautifulSoup", desc: "HTML parsing and data extraction", level: 90 },
                        { name: "Chrome WebDriver", desc: "Browser automation control", level: 88 }
                      ].map((tech, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                          whileHover={{ x: 5 }}
                        >
                          <div>
                            <div className="font-semibold text-gray-900 text-sm sm:text-base">{tech.name}</div>
                            <div className="text-xs sm:text-sm text-gray-600">{tech.desc}</div>
                          </div>
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
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
                      <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 mr-3" />
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">AI & Integration</h3>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { name: "Ollama", desc: "Local LLM deployment and management", level: 92 },
                        { name: "PyLaTeX", desc: "Dynamic document generation", level: 95 },
                        { name: "Notion API", desc: "Application tracking integration", level: 88 },
                        { name: "Pytest", desc: "Comprehensive testing framework", level: 90 }
                      ].map((tech, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                          whileHover={{ x: 5 }}
                        >
                          <div>
                            <div className="font-semibold text-gray-900 text-sm sm:text-base">{tech.name}</div>
                            <div className="text-xs sm:text-sm text-gray-600">{tech.desc}</div>
                          </div>
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Architecture Section */}
            <AnimatedSection id="architecture">
              <motion.div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Clean, Modular Architecture
                </h2>
                <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  Designed with testable components and separation of concerns for maintainability
                </p>
              </motion.div>

              

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12">
                <div className="space-y-12 flex flex-col">
                <motion.div 
                  className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      title: "Web Scraping Module",
                      description: "Isolated scraping logic with error handling and rate limiting",
                      icon: Search,
                      color: "purple"
                    },
                    {
                      title: "AI Processing Core",
                      description: "Local LLM integration with privacy-focused data handling",
                      icon: Brain,
                      color: "pink"
                    },
                    {
                      title: "Document Generator",
                      description: "LaTeX template engine with dynamic content personalization",
                      icon: FileText,
                      color: "purple"
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

                                <motion.div className="mt-4 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold mb-4">Generated Example</h3>
                  <Image
                    src="/images/resumeluke.png"
                    alt="Example Resume"
                    width={600}
                    height={400}
                    className="mx-auto rounded-lg shadow-lg"
                  />
                </motion.div>
              </div>

                {/* Technical Achievements */}
                <motion.div
                  className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg mt-12"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Key Technical Achievements</h3>
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      { icon: Award, title: "Document Processing Excellence", desc: "Sophisticated LaTeX resume processing with intelligent skill highlighting" },
                      { icon: Layers, title: "Modular Design", desc: "Clean separation of concerns with testable, maintainable components" },
                      { icon: Sparkles, title: "Privacy-First AI", desc: "Local LLM processing ensuring data never leaves your machine" },
                      { icon: TrendingUp, title: "Real-World Impact", desc: "Addresses genuine job search pain points with practical automation" }
                    ].map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                          <achievement.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{achievement.title}</div>
                          <div className="text-xs sm:text-sm text-gray-600">{achievement.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Impact Section */}
            <AnimatedSection id="impact">
              <motion.div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Real-World Impact & Innovation
                </h2>
                <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  Demonstrating practical AI application and full-stack development expertise
                </p>
              </motion.div>

              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 text-white">
                <motion.div 
                  className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      icon: Brain,
                      title: "AI Innovation",
                      description: "Showcasing practical AI integration with privacy-focused local processing"
                    },
                    {
                      icon: Zap,
                      title: "Automation Excellence",
                      description: "End-to-end pipeline automating tedious job application processes"
                    },
                    {
                      icon: Users,
                      title: "Professional Impact",
                      description: "Solving real career development challenges with intelligent tools"
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
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:inline-flex items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center">
                      <div>
                        <div className="text-xl sm:text-2xl font-bold">Active Development</div>
                        <div className="text-xs sm:text-sm text-white/80">Continuous Improvement</div>
                      </div>
                      <div className="w-16 h-px sm:w-px sm:h-12 bg-white/20 hidden sm:block"></div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold">Open Source</div>
                        <div className="text-xs sm:text-sm text-white/80">Community Driven</div>
                      </div>
                      <div className="w-16 h-px sm:w-px sm:h-12 bg-white/20 hidden sm:block"></div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold">Fully Functional</div>
                        <div className="text-xs sm:text-sm text-white/80">Production Ready</div>
                      </div>
                    </div>
                  </div>
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white text-purple-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore the Automation
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
