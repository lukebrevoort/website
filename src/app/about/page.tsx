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
    emoji: "🎷",
    label: "Jazz & Hip Hop",
    note: "Mac Miller, Coltrane, Miles Davis, Ryo Fukui — the soundtrack to the work.",
  },
  {
    emoji: "📖",
    label: "Reading",
    note: "Rick Rubin's The Creative Act right now. Sci-fi, systems thinking, and good nonfiction.",
  },
  {
    emoji: "🏀",
    label: "Basketball Talk",
    note: "Could talk hoops all day. The strategy, the stories, the legacy.",
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
    note: "The fuel behind most of the above.",
  },
];

const experiences = [
  {
    org: "Mytra",
    role: "Software Engineering Intern · Interactivity Team",
    note: "Building agentic AI diagnostics for warehouses. Splunk, Postgres, K8s logs, live sensor data — the kind of problem that keeps me up at night because I can't stop thinking about it.",
  },
  {
    org: "Stevens NLP Lab",
    role: "Research Assistant",
    note: "Only undergrad on a multilingual news-analysis team. Built the prototype, ran evaluations, learned how real research works — messy, humbling, and exactly what I needed.",
  },
  {
    org: "Blueprint",
    role: "Project Lead",
    note: "Shipping real software for nonprofit partners. Tickets, standups, stakeholder convos — leading a team from requirements to delivery.",
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
          <div className="container mx-auto py-8 px-4">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row items-center gap-8 mb-16"
            >
              <div className="lg:w-1/2 space-y-6">
                <h1
                  className={`text-4xl md:text-5xl ${lukesFont.className} leading-tight`}
                >
                  I believe everyone has good ideas.
                  <br />
                  <span className="text-muted-foreground">
                    The trick is putting the right people together.
                  </span>
                </h1>
                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                  I&apos;m Luke. I build systems — software, teams, budgets,
                  whatever needs building. I grew up in Colorado, go to school
                  in Hoboken, research NLP, intern at Mytra, and spend most of
                  my free time thinking about how to enable other people to
                  build too.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  This page isn&apos;t the resume. That&apos;s on the homepage.
                  This is the stuff that doesn&apos;t fit in a bullet point.
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

            {/* Where I come from */}
            <Card className="mb-16">
              <CardContent className="p-6 md:p-8">
                <h2
                  className={`${lukesFont.className} text-3xl md:text-4xl mb-6`}
                >
                  Where I come from.
                </h2>
                <div className="space-y-4 text-md md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
                  <p>
                    I grew up in Littleton, Colorado — a suburb south of Denver
                    where the Rockies are on the horizon and the air is dry
                    enough that you feel it. My dad&apos;s side of the family is
                    from Long Island, so I got to know NYC through them and fell
                    in love with the culture early. I&apos;ve always had a foot
                    in two very different worlds: mountain quiet and coastal hustle.
                  </p>
                  <p>
                    Colorado taught me something I didn&apos;t fully appreciate
                    until I left: the value of balance. I love the hustle, the
                    speed, the energy of a place like New York. But I also need
                    the ability to slow down, feel the nature, smell the flowers.
                    Colorado takes me back to being a kid in a way nowhere else
                    does, and that reminder — that you can move fast AND be
                    present — is one I carry everywhere.
                  </p>
                  <p>
                    My passion for building started with two things: Iron Man
                    and my dad. Iron Man because Tony Stark built things in a
                    cave with a box of scraps, and something about that clicked
                    for me. My dad because he showed me that building isn&apos;t
                    just about the thing you make — it&apos;s about enabling the
                    people around you to make their own things. That idea stuck.
                  </p>
                  <p>
                    I believe every person is creative. Really. It&apos;s not
                    about talent or training — it&apos;s about taking in enough
                    perspectives and opening your eyes to what&apos;s possible.
                    That belief is the thread through everything I do —
                    research, engineering, student government, mentoring. Put
                    the right people together and let them build.
                  </p>
                  <p>
                    That&apos;s what brought me to Stevens, to NLP research, to
                    Mytra, to every project I&apos;ve started. Not because I had
                    the answers, but because I wanted to be around people who
                    were asking good questions.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* NYC photo — the energy */}
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
                  New York in the rain. I go to school here now, and I still
                  haven&apos;t gotten used to the energy. Hope I never do.
                </figcaption>
              </figure>
            </motion.div>

            {/* What I'm into right now */}
            <Card className="mb-16">
              <CardContent className="p-6 md:p-8">
                <h2
                  className={`${lukesFont.className} text-3xl md:text-4xl mb-6`}
                >
                  What I&apos;m into right now.
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground mb-8 max-w-2xl">
                  The code stuff is on the homepage. Here&apos;s what fills the
                  rest of the day.
                </p>

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
                  <p className="text-md leading-relaxed text-muted-foreground">
                    I picked up Rick Rubin&apos;s book recently and it&apos;s
                    been living in my bag. It&apos;s less about music and more
                    about paying attention — which is basically what building
                    anything comes down to.
                  </p>
                  <p className="text-md leading-relaxed text-muted-foreground">
                    When I&apos;m working, it&apos;s usually Mac Miller or
                    Coltrane or Ryo Fukui on the speakers. Miles Davis when I
                    need to think. Hip hop and jazz — there&apos;s a throughline
                    there, the improvisation and the structure existing at the
                    same time. I love that tension.
                  </p>
                  <p className="text-md leading-relaxed text-muted-foreground">
                    Outside of music, I love to solo explore. There&apos;s a
                    beauty to being alone with your thoughts and your own
                    devices, planning your day and making it meaningful for
                    nobody else but yourself. I think that&apos;s something
                    people don&apos;t always expect about me. Same with the
                    fact that I used to be a picky eater — that always surprises
                    people.
                  </p>
                  <p className="text-md leading-relaxed text-muted-foreground">
                    I can talk sports all day — basketball especially. The
                    strategy, the stories, the rivalries. I played lacrosse for
                    years and still love the pace of it. And I&apos;ll never say
                    no to a good conversation about anything, really. That&apos;s
                    the Colorado in me, probably.
                  </p>
                </div>

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
                      <span
                        className="text-xl mt-0.5"
                        role="img"
                        aria-hidden="true"
                      >
                        {item.emoji}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.note}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Crocs photo */}
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

            {/* Stuff I've worked on */}
            <Card className="mb-16">
              <CardContent className="p-6 md:p-8">
                <h2
                  className={`${lukesFont.className} text-3xl md:text-4xl mb-6`}
                >
                  Stuff I&apos;ve worked on.
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground mb-8 max-w-2xl">
                  The homepage has the full story. These are the ones that
                  changed how I think.
                </p>
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
                    overwhelming — exactly what I needed. I love this city. Not
                    because it&apos;s glamorous, but because the people here are
                    grinding, they&apos;re ambitious, they&apos;re asking
                    interesting questions. That energy is contagious and
                    I&apos;m grateful to be around it.
                  </p>
                  <p>
                    If any of this resonates — or if you&apos;re building
                    something you care about — I&apos;d love to hear about it.
                    That&apos;s the whole point.
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
