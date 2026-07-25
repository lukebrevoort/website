"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { crimsonText, lukesFont } from "../fonts";
import { MotionConfig } from "framer-motion";
import { ModernAppSidebar } from "@/components/modern-app-sidebar";

const interests = [
  {
    emoji: "🥏",
    label: "Ultimate Frisbee",
    note: "Chasing discs and getting steps in.",
  },
  {
    emoji: "🏔️",
    label: "Skiing",
    note: "Nothing beats a bluebird day on the mountain.",
  },
  {
    emoji: "🏋️",
    label: "Weightlifting",
    note: "Moving heavy things, putting them back down.",
  },
  {
    emoji: "🥍",
    label: "Lacrosse",
    note: "Played through high school — still love the pace.",
  },
  {
    emoji: "📖",
    label: "Reading",
    note: "Sci-fi, systems thinking, and the occasional beat novel.",
  },
  {
    emoji: "☕",
    label: "Good Coffee",
    note: "The fuel behind most of these projects.",
  },
];

const experiences = [
  {
    org: "Mytra",
    role: "Software Engineering Intern · Interactivity Team",
    note: "Building agentic AI diagnostics for warehouses that move everything from groceries to auto parts.",
  },
  {
    org: "Stevens NLP Lab",
    role: "Research Assistant",
    note: "The only undergrad on a multilingual news-analysis team — built the prototype, ran evaluations, learned how research actually works.",
  },
  {
    org: "Blueprint",
    role: "Project Lead",
    note: "Leading a team shipping real software for nonprofit partners. Tickets, standups, stakeholder convos, the whole arc.",
  },
  {
    org: "Student Government Association",
    role: "Vice President of Finance",
    note: "Helping allocate the student activity fee across clubs, events, and initiatives that make campus life better.",
  },
  {
    org: "EH Yang Lab",
    role: "Undergraduate Researcher",
    note: "My first taste of real research — messy, humbling, and the reason I knew I wanted more of it.",
  },
];

export default function Page() {
  return (
    <ModernAppSidebar currentPath="/about">
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen p-4 md:p-8">
          <div className="container mx-auto py-8 px-4">
            {/* Hero — personal, not professional headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row items-center gap-8 mb-16"
            >
              <div className="lg:w-1/2 space-y-6">
                <h1 className={`text-4xl md:text-5xl ${lukesFont.className} leading-tight`}>
                  I like building things.
                  <br />
                  <span className="text-muted-foreground">
                    Code, words, ideas, coffee — same impulse.
                  </span>
                </h1>
                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                  I&apos;m Luke. I study Computer Science at Stevens, do research
                  in NLP, build agentic systems at Mytra, and spend way too much
                  time thinking about how to make complicated things feel simple.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  This page is the short version. Not the resume — that&apos;s
                  on the homepage. This is the part that doesn&apos;t fit in a
                  bullet point.
                </p>
              </div>
              <div className="lg:w-1/2">
                <Image
                  src="/images/greenSweater.jpg"
                  alt="Luke in a green sweater"
                  width={400}
                  height={400}
                  className="rounded-lg opacity-85 transition-all hover:opacity-100"
                />
              </div>
            </motion.div>

            {/* The personal narrative — who, why, how */}
            <Card className="mb-16">
              <CardContent className="p-6 md:p-8">
                <h2 className={`${lukesFont.className} text-3xl md:text-4xl mb-6`}>
                  The short version.
                </h2>
                <div className="space-y-4 text-md md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
                  <p>
                    I grew up in New Jersey, the oldest of four, which probably
                    explains the project-lead instinct. I was the kid taking
                    apart the family computer, the one who figured out that code
                    was just another way of asking "what if?" — and that the
                    answer was almost always worth pursuing.
                  </p>
                  <p>
                    By the time I got to Stevens, I already knew I wanted to
                    build things that mattered. AI and NLP pulled me in because
                    language is what makes us human, and teaching machines to
                    understand it feels like the hardest, most interesting
                    problem in the room. I joined the NLP lab as an undergrad —
                    the only one on a multilingual news-analysis team — and
                    learned that research is equal parts rigor and humility.
                  </p>
                  <p>
                    Outside the lab, I threw myself into student government,
                    first as Student Body President in high school, now as VP of
                    Finance at Stevens. I love the boring stuff — budgets,
                    systems, making sure the money goes where it actually helps.
                    It&apos;s the same instinct that draws me to infrastructure
                    and agent orchestration: the invisible work that lets
                    everything else happen.
                  </p>
                  <p>
                    At Mytra, I&apos;m building Mytra Oracle, an agentic
                    diagnostics platform that connects Splunk telemetry,
                    PostgreSQL data, Kubernetes logs, and live warehouse
                    sensor feeds to investigate production issues. It&apos;s the
                    kind of problem I can&apos;t stop thinking about — how do
                    you make something so complex feel almost obvious to the
                    person using it?
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Personal snapshot — the rainy NYC photo */}
            <motion.div
              className="flex justify-center w-full mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.85, y: 0 }}
              viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ opacity: 1 }}
            >
              <figure className="w-full md:w-1/2 space-y-2">
                <Image
                  src="/images/rainnyc.jpg"
                  alt="Rainy NYC street"
                  width={600}
                  height={300}
                  className="rounded-lg w-full"
                />
                <figcaption className="text-sm text-muted-foreground text-center italic">
                  New York in the rain. Still one of my favorite cities to get
                  lost in.
                </figcaption>
              </figure>
            </motion.div>

            {/* Between the Code — personal interests */}
            <Card className="mb-16">
              <CardContent className="p-6 md:p-8">
                <h2 className={`${lukesFont.className} text-3xl md:text-4xl mb-6`}>
                  Between the code.
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground mb-8 max-w-2xl">
                  I don&apos;t live in the terminal. The stuff that fills the
                  rest of the day matters just as much.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {interests.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      className="flex items-start gap-3 p-4 rounded-lg border border-border/40 bg-card/50 hover:bg-card/80 transition-colors"
                    >
                      <span className="text-xl mt-0.5" role="img" aria-hidden="true">
                        {item.emoji}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.note}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personal snapshot — crocs photo */}
            <motion.div
              className="flex justify-center w-full mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.85, y: 0 }}
              viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ opacity: 1 }}
            >
              <figure className="w-full md:w-1/2 space-y-2">
                <Image
                  src="/images/crocs.jpg"
                  alt="Crocs on a lawn"
                  width={600}
                  height={300}
                  className="rounded-lg w-full"
                />
                <figcaption className="text-sm text-muted-foreground text-center italic">
                  The footwear choice that says &ldquo;I have a systems design
                  meeting in 20 minutes.&rdquo;
                </figcaption>
              </figure>
            </motion.div>

            {/* A Few Things I've Built — narrative experience */}
            <Card className="mb-16">
              <CardContent className="p-6 md:p-8">
                <h2 className={`${lukesFont.className} text-3xl md:text-4xl mb-6`}>
                  A few things I&apos;ve worked on.
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground mb-8 max-w-2xl">
                  The resume has the full timeline. These are the ones that
                  shaped how I think.
                </p>
                <div className={`space-y-8 ${crimsonText.className}`}>
                  {experiences.map((item, index) => (
                    <motion.div
                      key={item.org}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                    >
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-foreground">
                          {item.org}
                        </h3>
                        <p className="text-md text-muted-foreground">{item.role}</p>
                        <p className="text-md leading-relaxed text-muted-foreground/80 max-w-2xl">
                          {item.note}
                        </p>
                      </div>
                      {index < experiences.length - 1 && <Separator className="mt-6" />}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personal snapshot — baby photo */}
            <motion.div
              className="flex justify-center w-full mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.85, y: 0 }}
              viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ opacity: 1 }}
            >
              <figure className="w-full md:w-1/2 space-y-2">
                <Image
                  src="/images/babyluke.jpeg"
                  alt="Baby Luke"
                  width={300}
                  height={250}
                  className="rounded-lg w-full"
                />
                <figcaption className="text-sm text-muted-foreground text-center italic">
                  Future builder of systems, circa 2006-ish.
                </figcaption>
              </figure>
            </motion.div>

            {/* Now / Currently — replaces the old contact section with something warmer */}
            <Card className="mb-8" id="now">
              <CardContent className="p-6 md:p-8">
                <h2 className={`${lukesFont.className} text-3xl md:text-4xl mb-6`}>
                  Right now.
                </h2>
                <div className="space-y-4 text-md md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
                  <p>
                    I&apos;m at Stevens in Hoboken, taking classes, running SGA
                    finance, and commuting to Brisbane for Mytra when I can.
                    I&apos;m reading about distributed systems, planning a
                    cross-country road trip, and trying to figure out how to
                    make time for everything.
                  </p>
                  <p>
                    If any of this resonates — or if you&apos;re building
                    something interesting — I&apos;d love to hear about it.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mt-8">
                  {[
                    {
                      href: "https://github.com/lukebrevoort",
                      src: "/icons/github-mark.svg",
                      alt: "GitHub",
                    },
                    {
                      href: "https://bsky.app/profile/luke-brev.bsky.social",
                      src: "/icons/bluesky.png",
                      alt: "Bluesky",
                    },
                    {
                      href: "https://www.linkedin.com/in/luke-brevoort-6a545626a/",
                      src: "/icons/linkedin.png",
                      alt: "LinkedIn",
                    },
                    {
                      href: "mailto:luke@brevoort.com",
                      src: "/icons/gmail.svg",
                      alt: "Email",
                    },
                    {
                      href: "https://instagram.com/luke.brev",
                      src: "/icons/instagram.svg",
                      alt: "Instagram",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2, ease: "easeOut" }}
                    >
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          width={48}
                          height={48}
                          className="opacity-70 hover:opacity-100 transition-all"
                        />
                      </a>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MotionConfig>
    </ModernAppSidebar>
  );
}
