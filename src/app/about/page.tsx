"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { crimsonText, lukesFont } from "../fonts";
import { MotionConfig } from "framer-motion";
import { ModernAppSidebar } from "@/components/modern-app-sidebar";

const interests = [
  {
    emoji: "🎷",
    label: "Jazz & Hip Hop",
    note: "Mac Miller, Denzel Curry, Coltrane, Miles Davis, Ryo Fukui",
  },
  {
    emoji: "📖",
    label: "Reading",
    note: "Rick Rubin's The Creative Act right now. Build by Tony Fadell as well.",
  },
  {
    emoji: "🏀",
    label: "Basketball Talk",
    note: "Could talk hoops all day. Denver Nuggests beating the 76ers in 6",
  },
  {
    emoji: "🥍",
    label: "Lacrosse",
    note: "Played for years. Miss the pace, still love the game.",
  },
  {
    emoji: "🏔️",
    label: "Skiing",
    note: "Colorado kid at heart. Bluebird days are therapy.",
  },
  {
    emoji: "🗺️",
    label: "Solo Exploring",
    note: "Wandering a new city alone with my thoughts and my own agenda.",
  },
  {
    emoji: "☕",
    label: "Good Coffee",
    note: "The fuel behind most of the above. Not much beats a great cup",
  },
];

const experiences = [
  {
    org: "Mytra",
    role: "Software Engineering Intern · Interactivity Team",
    note: "Building agentic AI diagnostics for warehouses. Splunk, Postgres, K8s logs, live sensor data. The kind of problem that keeps me up at night because I can't stop thinking about it.",
  },
  {
    org: "Stevens NLP Lab",
    role: "Research Assistant",
    note: "Only undergrad on a multilingual news-analysis team. Built the prototype, ran evaluations, learned how real research works — messy, humbling, and exactly what I needed.",
  },
  {
    org: "Blueprint",
    role: "Project Lead",
    note: "Shipping real software for nonprofit partners. Tickets, standups, stakeholder convos. Leading a team from requirements to delivery.",
  },
  {
    org: "Student Government Association",
    role: "Vice President of Finance",
    note: "Helping allocate the student activity fee across clubs and initiatives. Still the same instinct: making sure money goes where it helps.",
  },
  {
    org: "EH Yang Lab",
    role: "Undergraduate Researcher",
    note: "My first real taste of research. Messy, humbling, and the reason I knew I wanted more of it.",
  },
];

export default function Page() {
  return (
    <ModernAppSidebar currentPath="/about">
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen p-4 md:p-8">
          <div className="container mx-auto py-8 px-4" id="history">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row items-center gap-8 mb-16"
            >
              <div className="lg:w-1/2">
                <h1 className={`text-4xl ${lukesFont.className} mb-6`}>
                  I like building things in my freetime. coding, writing, and
                  creating :)
                </h1>
                <p
                  className={`text-2xl md:text-2xl leading-relaxed text-muted-foreground ${lukesFont.className}`}
                >
                  I&apos;m Luke. I build systems from software, teams, budgets,
                  whatever needs building. I grew up in Colorado, go to school
                  in Hoboken, research NLP, intern at Mytra, and spend most of
                  my free time thinking about how to enable other people to
                  build too.
                </p>
              </div>
              <div className="lg:w-1/2">
                <Image
                  src="/images/greenSweater.jpg"
                  alt="Me!"
                  width={400}
                  height={400}
                  className="rounded-lg opacity-85 transition-all hover:opacity-100"
                />
              </div>
            </motion.div>

            <Card className="mb-16">
              <CardContent className="p-6">
                <h2 className={`${lukesFont.className} text-3xl mb-6`}>
                  About:
                </h2>
                <div className="space-y-4 text-md md:text-lg leading-relaxed">
                  <p>
                    I grew up in Littleton, Colorado, one of the most pretty
                    places on the planet in my opinion. From hiking, climbing,
                    camping, backpacking, I have done it all with a smile.
                    Colorado will forever be my home,
                  </p>
                  <p>
                    Colorado taught me something I didn&apos;t fully appreciate
                    until I left which was the value of balance. I love the
                    hustle, the speed, the energy of a place like New York. But
                    I also need the ability to slow down, feel the nature, smell
                    the flowers. Colorado takes me back to being a kid in a way
                    nowhere else does, and that reminder that you can move fast
                    AND be present.
                  </p>
                  <p>
                    I found my love for building through a lot of avenues. I
                    like to joke it was easy to be inspired when as a kid I
                    thought for sure my Dad was Tony Stark. My family always
                    pushed me to solve problems and not settle for less, even if
                    that means spending hours to solve something that might have
                    been easier to brute force.
                  </p>
                  <p>
                    What continues to motivate what I build is this idea I have
                    that every person is creative. I find it strange people
                    attribute this like some arbitrary trait, but I find that
                    most great ideas do not always come from those with the most
                    knowledge. Taking in a fresh perspective is always
                    worthwhile.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-16">
              <CardContent className="p-6">
                <h2 className={`${lukesFont.className} text-3xl mb-6`}>
                  Education:
                </h2>
                <div className={`space-y-4 ${crimsonText.className}`}>
                  <div>
                    <h3 className="text-2xl font-bold">
                      Stevens Institute of Technology
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      Bachelor of Science in Computer Science
                    </p>
                    <Badge variant="outline">Expected May 2028</Badge>
                    <p className="mt-4">Relevant Coursework:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge>Data Structures</Badge>
                      <Badge>Algorithms</Badge>
                      <Badge>Computer Architecture</Badge>
                      <Badge>Discrete Structures</Badge>
                      <Badge>Linear Algebra</Badge>
                      <Badge>Calculus</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <motion.div
              className="flex justify-center w-full mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.85, y: 0 }}
              viewport={{
                once: true,
                amount: 0.3,
                margin: "0px 0px -100px 0px",
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ opacity: 1 }}
            >
              <div className="w-full md:w-1/2">
                <Image
                  src="/images/rainnyc.jpg"
                  alt="NYC rainy"
                  width={600}
                  height={300}
                  className="rounded-lg w-full"
                />
              </div>
            </motion.div>

            <Card className="mb-16">
              <CardContent className="p-6">
                <h2 className={`${lukesFont.className} text-4xl mb-6`}>
                  Skills:
                </h2>

                <div className="space-y-6 mb-8 max-w-3xl">
                  <div className="border-l-2 border-border/40 pl-4">
                    <p className="text-muted-foreground italic">
                      &ldquo;The goal is to be the person who can make something
                      happen.&rdquo;
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      — Rick Rubin, The Creative Act
                    </p>
                  </div>
                </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Leadership</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Event Planning</Badge>
                      <Badge>Communication</Badge>
                      <Badge>Working in Teams</Badge>
                      <Badge>Conflict Resolution</Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Familar With</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge>C++</Badge>
                      <Badge>Go</Badge>
                      <Badge>Bash</Badge>
                      <Badge>Node.js</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <motion.div
              className="flex justify-center w-full mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.85, y: 0 }}
              viewport={{
                once: true,
                amount: 0.3,
                margin: "0px 0px -100px 0px",
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ opacity: 1 }}
              id="experience"
            >
              <div className="w-full md:w-1/2">
                <Image
                  src="/images/crocs.jpg"
                  alt="NYC rainy"
                  width={600}
                  height={300}
                  className="rounded-lg w-full"
                />
              </div>
            </motion.div>

            <Card>
              <CardContent className="p-6">
                <h2 className={`${lukesFont.className} text-3xl mb-6`}>
                  Experience:
                </h2>
                <div className={`space-y-8 ${crimsonText.className}`}>
                  {experiences.map((item, index) => (
                    <motion.div
                      key={item.org}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                    >
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-foreground">
                          {item.org}
                        </h3>
                        <p className="text-md text-muted-foreground">
                          {item.role}
                        </p>
                        <p className="text-md leading-relaxed text-muted-foreground/80 max-w-2xl">
                          {item.note}
                        </p>
                      </div>
                      {index < experiences.length - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Baby photo */}
            <motion.div
              className="flex justify-center w-full mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.85, y: 0 }}
              viewport={{
                once: true,
                amount: 0.3,
                margin: "0px 0px -100px 0px",
              }}
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
                  Future builder of systems, Colorado edition, circa 2006-ish.
                </figcaption>
              </figure>
            </motion.div>

            {/* Right now */}
            <Card className="mb-8" id="now">
              <CardContent className="p-6 md:p-8">
                <h2
                  className={`${lukesFont.className} text-3xl md:text-4xl mb-6`}
                >
                  Right now.
                </h2>
                <div className="space-y-4 text-md md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
                  <p>
                    I&apos;m the second oldest of five kids, which I think
                    explains a lot about me. I&apos;m at Stevens in Hoboken now,
                    studying CS, running SGA finance, and commuting to Brisbane
                    for Mytra when I can. I&apos;m reading Rick Rubin, listening
                    to Mac Miller on repeat, and trying to get to the mountains
                    more often.
                  </p>
                  <p>
                    Moving from Colorado to Hoboken was a mix of exciting and
                    overwhelming. I love this city. Not because it&apos;s
                    glamorous, but because the people here are grinding,
                    they&apos;re ambitious, they&apos;re asking interesting
                    questions. That energy is contagious and I&apos;m grateful
                    to be around it.
                  </p>
                  <p>
                    If any of this resonates or if you&apos;re building
                    something you care abou, I&apos;d love to hear about it.
                    That&apos;s the whole point.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mt-8">
                  {[
                    {
                      title: "Mytra",
                      role: "Software Engineering Intern · Interactivity Team",
                      date: "Summer 2026",
                      description:
                        "Building AI solution software for Fortune 500 customers as part of the Interactivity Team.",
                    },
                    {
                      href: "https://www.linkedin.com/in/luke-brevoort-6a545626a/",
                      src: "/icons/linkedin.png",
                      alt: "LinkedIn",
                    },
                    {
                      title: "EH Yang Lab",
                      role: "Undergraduate Researcher",
                      date: "September 2024 – August 2025",
                    },
                    {
                      title: "Student Government Organization",
                      role: "Vice President of Finance",
                      date: "September 2024 – Present",
                    },
                    {
                      title: "Student Government Organization and NHS",
                      role: "Student Body President and National Honors Society VP",
                      date: "August 2023 – May 2024",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.2,
                        ease: "easeOut",
                      }}
                    >
                      <div>
                        <h3 className="text-2xl font-bold">{item.title}</h3>
                        <p className="text-muted-foreground text-lg">
                          {item.role}
                        </p>
                        <Badge variant="outline">{item.date}</Badge>
                        {item.description && (
                          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {index < 5 && <Separator className="mt-8" />}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <motion.div
              className="flex justify-center w-full mb-2 mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.85, y: 0 }}
              viewport={{
                once: true,
                amount: 0.3,
                margin: "0px 0px -100px 0px",
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              whileHover={{ opacity: 1 }}
              id="experience"
            >
              <div className="w-full md:w-1/2">
                <Image
                  src="/images/babyluke.jpeg"
                  alt="Baby Luke!"
                  width={300}
                  height={250}
                  className="rounded-lg w-full"
                />
              </div>
            </motion.div>
          </div>

          <Card className="mt-16 mb-8" id="contact">
            <CardContent className="p-6">
              <h2 className={`${lukesFont.className} text-3xl mb-6`}>
                Contact:
              </h2>
              <div className="flex justify-center gap-6">
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
                    transition={{
                      duration: 0.5,
                      delay: index * 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={64}
                        height={64}
                        className="opacity-85 hover:opacity-100 transition-all"
                      />
                    </a>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </MotionConfig>
    </ModernAppSidebar>
  );
}
