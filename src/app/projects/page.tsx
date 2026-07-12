"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { ModernAppSidebar } from "@/components/modern-app-sidebar";
import { crimsonText, satoshi } from "@/app/fonts";

type StatusFilter = "all" | "in-progress" | "completed";

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState<StatusFilter>("all");
  const categories = ["All", ...Array.from(new Set(projects.map((project) => project.category)))];
  const orderedProjects = [...projects].sort((a, b) => Number(b.id) - Number(a.id));
  const activeProjects = projects.filter((project) => project.status === "in-progress").length;

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return orderedProjects.filter((project) => {
      const matchesQuery = !normalizedQuery || [project.title, project.description, ...project.technologies]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesCategory = category === "All" || project.category === category;
      const matchesStatus = status === "all" || project.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, orderedProjects, query, status]);

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setStatus("all");
  };

  return (
    <ModernAppSidebar currentPath="/projects" backgroundGradient="bg-[#f7f5f0]">
      <main className={`min-h-screen overflow-hidden ${satoshi.className}`}>
        <div className="relative border-b border-stone-300/70 bg-[#ede9df] px-5 pb-12 pt-14 sm:px-8 sm:pt-20 lg:px-12">
          <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(#897e6d_0.65px,transparent_0.65px)] [background-size:12px_12px]" />
          <div className="relative mx-auto max-w-7xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold uppercase tracking-[0.32em] text-stone-500"
            >
              Selected work · 2025—2026
            </motion.p>
            <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                <h1 className={`${crimsonText.className} max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.045em] text-stone-900 sm:text-7xl`}>
                  Things I&apos;ve made,
                  <span className="block text-stone-500">and keep making.</span>
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
                  A living archive of products, experiments, and systems—from personal tools to work that helps teams think together.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.16 }}
                className="grid grid-cols-2 divide-x divide-stone-300 border-y border-stone-300 py-4 text-stone-900 lg:w-[270px]"
              >
                <div className="pr-5">
                  <p className="text-3xl font-semibold tracking-[-0.06em]">{projects.length}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Projects</p>
                </div>
                <div className="pl-5">
                  <p className="text-3xl font-semibold tracking-[-0.06em]">{activeProjects}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">In progress</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="flex flex-col gap-5 border-b border-stone-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 text-sm font-semibold text-stone-700">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Explore the archive</span>
            </div>
            <div className="relative w-full lg:w-[320px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects or tools"
                className="w-full rounded-full border border-stone-200 bg-white py-3 pl-10 pr-10 text-sm text-stone-800 outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-200/60"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700" aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-5">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" aria-label="Filter by category">
              {categories.map((item) => (
                <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${category === item ? "bg-stone-900 text-white" : "border border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:text-stone-800"}`}>
                  {item}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(["all", "in-progress", "completed"] as StatusFilter[]).map((item) => (
                <button key={item} onClick={() => setStatus(item)} className={`rounded-full px-3 py-1.5 text-sm transition ${status === item ? "bg-stone-200 text-stone-900" : "text-stone-500 hover:text-stone-900"}`}>
                  {item === "all" ? "Everything" : item.replace("-", " ")}
                </button>
              ))}
              <span className="ml-auto text-sm text-stone-500">{visibleProjects.length} shown</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {visibleProjects.length > 0 ? (
              <motion.div key="project-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleProjects.map((project, index) => (
                  <motion.div key={project.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.045, 0.3) }} className={index === 0 ? "md:col-span-2 xl:col-span-2" : ""}>
                    <ProjectCard {...project} variant={index === 0 ? "featured" : "standard"} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center">
                <p className={`${crimsonText.className} text-3xl text-stone-800`}>Nothing found in this corner of the archive.</p>
                <button onClick={clearFilters} className="mt-5 text-sm font-semibold text-stone-600 underline decoration-stone-300 underline-offset-4 hover:text-stone-900">Reset filters</button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </ModernAppSidebar>
  );
}
