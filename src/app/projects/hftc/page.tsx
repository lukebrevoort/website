'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  ExternalLink, 
  Github, 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock, 
  Target,
  Brain,
  Monitor,
  Database,
  Activity,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Sparkles,
  Timer,
  LineChart,
  AlertTriangle,
  Settings
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
      className="mb-24"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  )
}

// Animated trading chart component
function TradingChart() {
  return (
    <div className="relative h-48 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-green-400 font-mono text-sm">CS1/CS2</div>
          <div className="text-green-400 font-mono text-sm">+$2,847.32</div>
        </div>
        <div className="flex items-end space-x-1 h-24">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-t from-green-500 to-green-300 w-2 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: Math.random() * 96 + 20 }}
              transition={{ 
                duration: 2, 
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 3
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HFTCPage() {
  const [activeItem, setActiveItem] = useState('#overview')
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const project = getProjectBySlug('hftc')
  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Strategies', href: '#strategies' },
    { name: 'Technology', href: '#technology' },
    { name: 'Competition', href: '#competition' },
    { name: 'Performance', href: '#performance' },
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
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
              className="mb-16"
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}
            >
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-sm font-semibold text-green-800 mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  High-Frequency Trading System
                </motion.div>
                
                <motion.h1 
                  className="text-6xl font-black text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  HFTC System
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  A sophisticated dual-strategy algorithmic trading system engineered for the Stevens 
                  High-Frequency Trading Competition, featuring market making and momentum arbitrage 
                  with real-time risk management.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-wrap justify-center gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                
                <motion.a
                  href="https://fsc.stevens.edu/2025-high-frequency-trading-competition-recap/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  {...scaleOnHover}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Competition Details
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
                    Elite Algorithmic Trading Competition
                  </h2>
                  <div className="prose prose-lg text-gray-700">
                    <p className="mb-4">
                      Competing in the prestigious <strong>Stevens High-Frequency Trading Competition</strong>, 
                      our system battled against 22 international teams across 5 challenging trading scenarios 
                      spanning <strong>6-hour live trading sessions</strong>.
                    </p>
                    <p className="mb-4">
                      Built on Stevens' proprietary <strong>SHIFT platform</strong>, the system leveraged 
                      real-time order book analysis, advanced technical indicators, and intelligent 
                      risk management to navigate volatile market conditions.
                    </p>
                    <div className="flex items-center text-green-600 font-semibold">
                      <Target className="h-5 w-5 mr-2" />
                      Dual-Strategy Algorithmic Trading
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
                  <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 shadow-2xl">
                    <TradingChart />
                    <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                      <Activity className="h-6 w-6" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Trading Strategies Section */}
            <AnimatedSection id="strategies">
              <motion.div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Advanced Trading Strategies
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Dual-strategy approach combining market making and momentum arbitrage for optimal performance
                </p>
              </motion.div>

              <motion.div 
                className="grid md:grid-cols-2 gap-8 mb-12"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    icon: BarChart3,
                    title: "Market Making Strategy",
                    description: "Order book imbalance analysis with dynamic bid-ask spread optimization and intelligent inventory management.",
                    features: ["Order Book Analysis", "Bid-Ask Optimization", "Inventory Management", "Liquidity Provision"],
                    gradient: "from-red-500 to-gray-500"
                  },
                  {
                    icon: TrendingUp,
                    title: "Momentum Arbitrage",
                    description: "8+ technical indicators including RSI, MACD, and Bollinger Bands for trend identification and signal generation.",
                    features: ["RSI Analysis", "MACD Crossovers", "Bollinger Bands", "Trend Detection"],
                    gradient: "from-gray-500 to-red-500"
                  }
                ].map((strategy, index) => (
                  <motion.div
                    key={index}
                    className="group"
                    variants={fadeInUpVariants}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${strategy.gradient} rounded-xl text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <strategy.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{strategy.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">{strategy.description}</p>
                      <div className="space-y-2">
                        {strategy.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Technical Indicators Grid */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {[
                  { name: "RSI", desc: "Relative Strength", icon: LineChart },
                  { name: "MACD", desc: "Moving Average", icon: TrendingUp },
                  { name: "Bollinger", desc: "Volatility Bands", icon: BarChart3 },
                  { name: "Smart Order", desc: "Routing Logic", icon: Target }
                ].map((indicator, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-md border border-gray-200 text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <indicator.icon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-sm font-bold text-gray-900">{indicator.name}</div>
                    <div className="text-xs text-gray-600">{indicator.desc}</div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>

            {/* Technology Stack Section */}
            <AnimatedSection id="technology">
              <motion.div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  High-Performance Technology Stack
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Built for microsecond precision and real-time market data processing
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
                      <Monitor className="h-8 w-8 text-red-500 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">Trading Engine</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: "Python", desc: "Core algorithm development", level: 95 },
                        { name: "NumPy/Pandas", desc: "High-performance data processing", level: 92 },
                        { name: "SHIFT API", desc: "Stevens trading platform integration", level: 88 },
                        { name: "Real-time Processing", desc: "Microsecond order execution", level: 90 }
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
                          <CheckCircle className="h-5 w-5 text-red-500" />
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
                      <Shield className="h-8 w-8 text-gray-500 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">Risk Management</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: "Portfolio Monitoring", desc: "Real-time P&L tracking", level: 98 },
                        { name: "Trailing Stops", desc: "Dynamic stop-loss protection", level: 95 },
                        { name: "Position Sizing", desc: "Adaptive risk allocation", level: 92 },
                        { name: "Cooldown Periods", desc: "Automated trading pauses", level: 88 }
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
                          <CheckCircle className="h-5 w-5 text-gray-500" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Competition Details Section */}
            <AnimatedSection id="competition">
              <motion.div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Stevens HFTC 2025 Competition
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  5-week intensive competition across diverse market scenarios with international participants
                </p>
              </motion.div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
                <motion.div 
                  className="grid lg:grid-cols-2 gap-12 mb-12"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Competition Format</h3>
                    <div className="space-y-4">
                      {[
                        { day: "Day 1-3", scenario: "Historical Data", desc: "Up/Down Days, Peak Swings, High VIX" },
                        { day: "Day 4", scenario: "Zero-Intelligence", desc: "Random trading agents simulation" },
                        { day: "Day 5", scenario: "RL Agents", desc: "14 adaptive reinforcement learning bots" }
                      ].map((phase, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm"
                          variants={fadeInUpVariants}
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-red-500 to-gray-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{phase.day}: {phase.scenario}</div>
                            <div className="text-sm text-gray-600">{phase.desc}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Global Competition</h3>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="grid grid-cols-2 gap-6 text-center">
                        <div>
                          <div className="text-3xl font-bold text-red-600">22</div>
                          <div className="text-sm text-gray-600">International Teams</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-gray-600">6</div>
                          <div className="text-sm text-gray-600">Hour Sessions</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-red-700">5</div>
                          <div className="text-sm text-gray-600">Trading Scenarios</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-gray-700">1</div>
                          <div className="text-sm text-gray-600">SHIFT Platform</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Performance Analytics Section */}
            <AnimatedSection id="performance">
              <motion.div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Performance Analytics & Risk Management
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Sophisticated monitoring and optimization framework for consistent performance
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
                      icon: BarChart3,
                      title: "Real-time P&L Tracking",
                      description: "Automated profit and loss monitoring with performance analytics across all trading sessions"
                    },
                    {
                      icon: Shield,
                      title: "Dynamic Risk Controls",
                      description: "Trailing stops and adaptive position sizing to protect against market volatility"
                    },
                    {
                      icon: Timer,
                      title: "Execution Optimization",
                      description: "Smart order routing with microsecond precision for optimal market entry and exit"
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
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-red-500 to-gray-500 rounded-xl flex items-center justify-center text-white">
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
                  <div className="bg-gradient-to-br from-red-100 to-gray-100 rounded-3xl p-8 shadow-2xl">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                        <TrendingUp className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-900">Sharpe Ratio</div>
                        <div className="text-2xl font-bold text-red-600">1.80</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                        <Shield className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-900">Max Drawdown</div>
                        <div className="text-2xl font-bold text-gray-600">-3.2%</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                        <DollarSign className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-900">Win Rate</div>
                        <div className="text-2xl font-bold text-red-700">73%</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                        <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-900">Avg Trade</div>
                        <div className="text-2xl font-bold text-gray-700">2.3s</div>
                      </div>
                    </div>
                    <TradingChart />
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Impact Section */}
            <AnimatedSection id="impact">
              <motion.div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Competitive Impact & Technical Achievement
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Demonstrating advanced algorithmic trading capabilities in a world-class competition
                </p>
              </motion.div>

              <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white">
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
                      title: "Algorithmic Sophistication",
                      description: "Dual-strategy system with 8+ technical indicators and intelligent risk management"
                    },
                    {
                      icon: Zap,
                      title: "Real-time Execution",
                      description: "Microsecond precision trading with adaptive position sizing and smart order routing"
                    },
                    {
                      icon: Target,
                      title: "Competitive Excellence",
                      description: "Competing against international teams in prestigious Stevens HFTC competition"
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
                    Experience advanced algorithmic trading in action
                  </p>
                  <motion.a
                    href="https://fsc.stevens.edu/2025-high-frequency-trading-competition-recap/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn About the Competition
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
