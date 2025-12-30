"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useInView } from "framer-motion";
import Image from "next/image";
import {
  Bot,
  FileText,
  Zap,
  Brain,
  Clock,
  MessageSquare,
  Mail,
  Database,
  ArrowRight,
  CheckCircle,
  Workflow,
  Filter,
  Send,
  Code,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from "lucide-react";
import ProjectSidebar from "@/components/project-sidebar";
import { getProjectBySlug } from "@/data/projects";

// Animated section wrapper
function AnimatedSection({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`mb-12 sm:mb-16 md:mb-24 ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

// Section header component for consistency
function SectionHeader({
  title,
  subtitle,
  step,
}: {
  title: string;
  subtitle?: string;
  step?: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12">
      {step && (
        <motion.div
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-semibold text-purple-700 mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          {step}
        </motion.div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Workflow image with caption
function WorkflowImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative w-full">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={600}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <div className="px-5 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100">
          <p className="text-sm sm:text-base text-gray-700 italic">{caption}</p>
        </div>
      )}
    </motion.div>
  );
}

// Code block component
function CodeBlock({
  code,
  language = "javascript",
}: {
  code: string;
  language?: string;
}) {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-900 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-sm text-gray-400 font-mono">{language}</span>
      </div>
      <pre className="p-5 overflow-x-auto">
        <code className="text-sm sm:text-base text-gray-100 font-mono whitespace-pre-wrap break-all">
          {code}
        </code>
      </pre>
    </motion.div>
  );
}

// Tech stack card with gradient
function TechCard({
  name,
  description,
  icon: Icon,
  gradient,
}: {
  name: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <motion.div
      className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${gradient} rounded-xl text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
        {name}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

// Process step card
function ProcessStep({
  number,
  title,
  description,
  icon: Icon,
  isLast = false,
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
  isLast?: boolean;
}) {
  return (
    <motion.div
      className="flex items-start gap-5"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: number * 0.1 }}
    >
      <div className="flex flex-col items-center">
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-sm sm:text-base font-bold shadow-lg z-10">
          {number}
        </div>
        {!isLast && (
          <div className="w-0.5 h-full bg-purple-200 mt-2 min-h-[40px]" />
        )}
      </div>
      <div className={`flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5 text-purple-600" />
          <h4 className="text-base sm:text-lg font-bold text-gray-900">
            {title}
          </h4>
        </div>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function JobPersonalizerPage() {
  const [activeItem, setActiveItem] = useState("#overview");
  const containerRef = useRef<HTMLDivElement>(null);
  useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const project = getProjectBySlug("job-personalizer");
  if (!project) {
    return <div>Project not found</div>;
  }

  const navigation = [
    { name: "Overview", href: "#overview" },
    { name: "Tech Stack", href: "#tech-stack" },
    { name: "Step 1: Job Pulling", href: "#step-1" },
    { name: "Step 2: Personalization", href: "#step-2" },
    { name: "Human-in-the-Loop", href: "#human-in-loop" },
    { name: "Impact", href: "#impact" },
  ];

  const handleItemClick = (href: string) => {
    setActiveItem(href);
  };

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50"
    >
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-semibold text-purple-800 mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Workflow className="h-4 w-4 mr-2" />
                  n8n Workflow Automation
                </motion.div>

                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Resume Personalization, Automated
                </motion.h1>

                <motion.p
                  className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  After building my own resume personalizer using LangChain and
                  Ollama, I moved to n8n to add quality-of-life features like{" "}
                  <strong>Human-in-the-Loop</strong> through Gmail and{" "}
                  <strong>job selection</strong> via Slack.
                </motion.p>
              </div>

              <motion.div
                className="flex flex-wrap justify-center gap-2 sm:gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {project.technologies.map((tech, index) => (
                  <motion.span
                    key={tech}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-purple-200 rounded-xl text-sm sm:text-base text-purple-700 font-medium shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Overview Section */}
            <AnimatedSection id="overview">
              <SectionHeader
                title="How It Works"
                subtitle="A two-part workflow that handles everything from job discovery to resume submission"
              />

              <motion.div
                className="grid md:grid-cols-2 gap-6 sm:gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div
                  className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                  variants={fadeInUpVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Part 1: Job Pulling
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg text-gray-600 mb-5 leading-relaxed">
                    Every 5 hours, the workflow pulls new SWE internship
                    postings, filters them, adds them to Notion, and sends me a
                    Slack message to choose which ones to pursue.
                  </p>
                  <div className="flex items-center text-purple-600 font-semibold">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="text-base">Scheduled Trigger</span>
                  </div>
                </motion.div>

                <motion.div
                  className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                  variants={fadeInUpVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Part 2: Personalization
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg text-gray-600 mb-5 leading-relaxed">
                    When I select jobs, the workflow scrapes the posting,
                    extracts key skills with one LLM, optimizes my Typst resume
                    with another, and lets me approve via Gmail.
                  </p>
                  <div className="flex items-center text-pink-600 font-semibold">
                    <Brain className="w-5 h-5 mr-2" />
                    <span className="text-base">Dual-LLM Processing</span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatedSection>

            {/* Tech Stack Section */}
            <AnimatedSection id="tech-stack">
              <SectionHeader
                title="Tech Stack"
                subtitle="The tools and integrations powering this workflow"
              />

              <motion.div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={fadeInUpVariants}>
                  <TechCard
                    name="n8n"
                    description="Visual workflow automation platform orchestrating the entire pipeline"
                    icon={Workflow}
                    gradient="from-purple-500 to-pink-500"
                  />
                </motion.div>
                <motion.div variants={fadeInUpVariants}>
                  <TechCard
                    name="Slack"
                    description="Block Kit messages with Multi-Static Select for job selection"
                    icon={MessageSquare}
                    gradient="from-blue-500 to-cyan-500"
                  />
                </motion.div>
                <motion.div variants={fadeInUpVariants}>
                  <TechCard
                    name="Gmail"
                    description="Human-in-the-loop approval and feedback collection"
                    icon={Mail}
                    gradient="from-red-500 to-orange-500"
                  />
                </motion.div>
                <motion.div variants={fadeInUpVariants}>
                  <TechCard
                    name="Notion"
                    description="Job database for tracking applications and storing resumes"
                    icon={Database}
                    gradient="from-gray-700 to-gray-900"
                  />
                </motion.div>
                <motion.div variants={fadeInUpVariants}>
                  <TechCard
                    name="Ollama"
                    description="Local LLM deployment for skill extraction and resume optimization"
                    icon={Brain}
                    gradient="from-green-500 to-teal-500"
                  />
                </motion.div>
                <motion.div variants={fadeInUpVariants}>
                  <TechCard
                    name="Typst"
                    description="Modern typesetting system for resume generation"
                    icon={FileText}
                    gradient="from-indigo-500 to-purple-500"
                  />
                </motion.div>
              </motion.div>
            </AnimatedSection>

            {/* Step 1: Job Pulling Section */}
            <AnimatedSection id="step-1">
              <SectionHeader
                step="Part 1"
                title="Job Pulling & Selection"
                subtitle="Automated job discovery with Slack-based selection"
              />

              <div className="space-y-8 sm:space-y-10">
                {/* Workflow diagram */}
                <WorkflowImage
                  src="/images/slackn8nsuperthingy.png"
                  alt="n8n workflow for job pulling and Slack integration"
                  caption="The n8n workflow: Scheduled trigger → HTTP request → Filter → Notion comparison → Slack notification"
                />

                {/* Process steps */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-lg">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
                    How it works
                  </h3>
                  <div className="space-y-2">
                    <ProcessStep
                      number={1}
                      title="Scheduled Trigger"
                      description="Every 5 hours, the workflow automatically runs on a scheduled trigger."
                      icon={Clock}
                    />
                    <ProcessStep
                      number={2}
                      title="HTTP Request to Job Repo"
                      description="Pulls ALL jobs from a SWE Internship Job Repository (thanks Vansh & Ouckah!)."
                      icon={Zap}
                    />
                    <ProcessStep
                      number={3}
                      title="Filter Recent Jobs"
                      description="Filters to only jobs posted within the last 7 days."
                      icon={Filter}
                    />
                    <ProcessStep
                      number={4}
                      title="Compare with Notion"
                      description="Checks against my Notion database to avoid duplicates. New jobs get added automatically."
                      icon={Database}
                    />
                    <ProcessStep
                      number={5}
                      title="Slack Notification"
                      description="Sends a customized Block Kit message to my Slack with a Multi-Static Select to choose jobs."
                      icon={Send}
                      isLast={true}
                    />
                  </div>
                </div>

                {/* Slack message preview */}
                <WorkflowImage
                  src="/images/SLAckmessagen8nin.png"
                  alt="Slack message with job selection interface"
                  caption="The Slack message I receive with Multi-Static Select for choosing which jobs to personalize"
                />

                <motion.div
                  className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-purple-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        After Selection
                      </h4>
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                        When I choose which jobs to pursue, the selection is
                        sent back to n8n, and those positions are marked as
                        &quot;Considering&quot; in my Notion database,
                        triggering Part 2.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Step 2: Personalization Section */}
            <AnimatedSection id="step-2">
              <SectionHeader
                step="Part 2"
                title="Resume Personalization"
                subtitle="Dual-LLM processing for intelligent resume optimization"
              />

              <div className="space-y-8 sm:space-y-10">
                {/* Workflow diagram */}
                <WorkflowImage
                  src="/images/personalizen8nintegr.png"
                  alt="n8n workflow for resume personalization"
                  caption="The personalization workflow: Notion trigger → HTTP request → HTML parsing → Dual-LLM processing"
                />

                {/* Process explanation */}
                <motion.div
                  className="grid md:grid-cols-2 gap-6 sm:gap-8"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                    variants={fadeInUpVariants}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Code className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Job Scraping
                      </h3>
                    </div>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                      The workflow triggers when a job is marked
                      &quot;Considering&quot; in Notion. It makes an HTTP
                      request to the job URL and extracts all HTML from the
                      page. If the URL is no longer available, I get an email
                      notification.
                    </p>
                  </motion.div>

                  <motion.div
                    className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                    variants={fadeInUpVariants}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Dual-LLM Pipeline
                      </h3>
                    </div>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                      <strong>LLM #1 (Skill Categorizer):</strong> Identifies
                      the most important skills to highlight.
                      <br />
                      <strong>LLM #2 (Resume Maker):</strong> Takes my Typst
                      resume and optimizes it for the specific role.
                    </p>
                  </motion.div>
                </motion.div>

                {/* Workday handling */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 md:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <Code className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      Handling Workday&apos;s SOAP Redirects
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg text-gray-300 mb-6 leading-relaxed">
                    Some platforms like Workday render their HTML via scripts
                    after the initial URL call, giving us a SOAP redirect. After
                    investigating the network requests, I found Workday uses a
                    predictable URL pattern:
                  </p>
                  <CodeBlock
                    code={`https://\${tenant}.wd5.myworkdayjobs.com/wday/cxs/\${tenant}/\${siteId}/job/\${tail}`}
                    language="javascript"
                  />
                </div>
              </div>
            </AnimatedSection>

            {/* Human-in-the-Loop Section */}
            <AnimatedSection id="human-in-loop">
              <SectionHeader
                step="Approval Flow"
                title="Human-in-the-Loop"
                subtitle="Gmail-based approval with iterative refinement"
              />

              <div className="space-y-8 sm:space-y-10">
                {/* Workflow diagram */}
                <WorkflowImage
                  src="/images/humanintheloopn8n.png"
                  alt="n8n workflow for human-in-the-loop approval via Gmail"
                  caption="The approval workflow: Resume generation → Gmail notification → Approve/Deny → Iterative refinement"
                />

                {/* Approval flow explanation */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-lg">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 text-center">
                    The Approval Process
                  </h3>

                  <motion.div
                    className="grid md:grid-cols-3 gap-6 sm:gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="text-center"
                      variants={fadeInUpVariants}
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                        Email Notification
                      </h4>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        After the LLMs generate a resume, I receive an email
                        with the Typst code to compile and review.
                      </p>
                    </motion.div>

                    <motion.div
                      className="text-center"
                      variants={fadeInUpVariants}
                    >
                      <div className="flex justify-center gap-3 mb-5">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                          <ThumbsUp className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                          <ThumbsDown className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                        Approve or Deny
                      </h4>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        I can approve the resume or deny with specific feedback
                        on what to change.
                      </p>
                    </motion.div>

                    <motion.div
                      className="text-center"
                      variants={fadeInUpVariants}
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                        Iterative Refinement
                      </h4>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        If denied, my feedback is extracted and fed back to the
                        Resume Optimizer for as many iterations as needed.
                      </p>
                    </motion.div>
                  </motion.div>
                </div>

                <motion.div
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        Once Approved
                      </h4>
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                        The finalized resume is added to Notion in blocks and
                        chunks, and the job status is updated so I can go ahead
                        and submit the application.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Impact Section */}
            <AnimatedSection id="impact">
              <SectionHeader
                title="Results & Impact"
                subtitle="What this automation enables"
              />

              <div className="space-y-8 sm:space-y-10">
                {/* Generated resume example */}
                <motion.div
                  className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 text-center">
                    Generated Resume Example
                  </h3>
                  <div className="flex justify-center">
                    <Image
                      src="/images/NEWRESUME.png"
                      alt="Example of a generated personalized resume"
                      width={500}
                      height={650}
                      className="rounded-xl shadow-2xl border border-gray-200"
                    />
                  </div>
                </motion.div>

                {/* Benefits grid */}
                <motion.div
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      title: "Time Saved",
                      description:
                        "Automated job discovery and resume customization eliminates hours of manual work",
                      icon: Clock,
                      gradient: "from-purple-500 to-pink-500",
                    },
                    {
                      title: "Quality Control",
                      description:
                        "Human-in-the-loop ensures every resume meets my standards before submission",
                      icon: CheckCircle,
                      gradient: "from-green-500 to-emerald-500",
                    },
                    {
                      title: "Skill Matching",
                      description:
                        "Dual-LLM pipeline identifies and highlights the most relevant skills for each role",
                      icon: Brain,
                      gradient: "from-blue-500 to-cyan-500",
                    },
                    {
                      title: "Centralized Tracking",
                      description:
                        "All jobs and resumes organized in Notion for easy application management",
                      icon: Database,
                      gradient: "from-gray-700 to-gray-900",
                    },
                    {
                      title: "Iterative Improvement",
                      description:
                        "Feedback loop allows unlimited refinement until the resume is perfect",
                      icon: RefreshCw,
                      gradient: "from-orange-500 to-amber-500",
                    },
                    {
                      title: "Never Miss a Job",
                      description:
                        "Scheduled triggers ensure I see every relevant posting within 7 days",
                      icon: Zap,
                      gradient: "from-yellow-500 to-orange-500",
                    },
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                      variants={fadeInUpVariants}
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${benefit.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        {benefit.title}
                      </h4>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Final CTA */}
                <motion.div
                  className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    From Manual to Automated
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed mb-8">
                    This project represents the evolution from a
                    Python/LangChain prototype to a production-ready n8n
                    workflow with real-world integrations. The human-in-the-loop
                    approach ensures quality while automation handles the
                    tedious parts.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:inline-flex items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold">
                        Active Development
                      </div>
                      <div className="text-sm sm:text-base text-purple-200">
                        Continuous Improvement
                      </div>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-white/30"></div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold">
                        Personal Use
                      </div>
                      <div className="text-sm sm:text-base text-purple-200">
                        Built for My Workflow
                      </div>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-white/30"></div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold">
                        Fully Functional
                      </div>
                      <div className="text-sm sm:text-base text-purple-200">
                        Production Ready
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </main>
      </ProjectSidebar>
    </div>
  );
}
