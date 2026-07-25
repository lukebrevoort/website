import type { Metadata } from "next";
import { Download, ExternalLink, FileText } from "lucide-react";
import { ModernAppSidebar } from "@/components/modern-app-sidebar";
import { lukesFont } from "@/app/fonts";

export const metadata: Metadata = {
  title: "Resume | Luke Brevoort",
  description: "Luke Brevoort's resume",
};

const resumePath = "/resume/luke-brevoort-resume.pdf";

export default function ResumePage() {
  return (
    <ModernAppSidebar currentPath="/resume">
      <main className="min-h-screen p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-6 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText aria-hidden="true" size={16} />
                Resume
              </p>
              <h1 className={`text-4xl ${lukesFont.className}`}>
                Luke Brevoort
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                href={resumePath}
                target="_blank"
                rel="noreferrer"
              >
                Open PDF
                <ExternalLink aria-hidden="true" size={16} />
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                href={resumePath}
                download
              >
                Download
                <Download aria-hidden="true" size={16} />
              </a>
            </div>
          </header>

          <iframe
            className="h-[calc(100vh-14rem)] min-h-[42rem] w-full rounded-lg border border-border bg-white shadow-sm"
            src={`${resumePath}#view=FitH`}
            title="Luke Brevoort resume"
          />
        </div>
      </main>
    </ModernAppSidebar>
  );
}
