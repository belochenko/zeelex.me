"use client"

import Link from "next/link"
import { Github, Linkedin, Mail, ExternalLink, ArrowUpRight } from "lucide-react"
import { Mascot } from "@/components/mascot"
import { BentoTile } from "@/components/bento-tile"

/* ─── WORK STATUS CONFIGURATION ────────────────────────────────── */

export type WorkStatus = "open_for_work" | "open_for_projects" | "unavailable";

export const CURRENT_WORK_STATUS: WorkStatus = "open_for_work";

export const WORK_STATUS_CONFIG: Record<
  WorkStatus,
  { label: string; color: string; mascotLabel?: string }
> = {
  open_for_work: {
    label: "STATUS: OPEN FOR WORK",
    color: "var(--accent-emerald)", // Green
    mascotLabel: "HIRE ME",
  },
  open_for_projects: {
    label: "STATUS: GIGS ONLY",
    color: "var(--accent-orange)", // Orange
    mascotLabel: "PROJECTS",
  },
  unavailable: {
    label: "STATUS: UNAVAILABLE",
    color: "var(--tx-muted)", // Gray
    mascotLabel: "BUSY",
  },
};

/* ─── DATA ─────────────────────────────────────────────────────── */

const socialLinks = [
  { icon: Github, label: "GitHub", url: "https://github.com/belochenko" },
  { icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/zeelexes/" },
  { icon: Mail, label: "Email", url: "mailto:hi@zeelex.me" },
]

const projects = [
  {
    title: "Home 3D Printing Lab",
    oneLiner: "Exploring additive manufacturing at home — hardware, materials, and process design.",
    tags: ["3D Printing", "Hardware", "Design"],
    accentColor: "var(--accent-orange)",
    status: "live",
    imagePath: "/projects/3d_printer.png",
    detail: "A personal laboratory for additive manufacturing experiments — from FDM mechanics to material science and tolerancing. Hosted at 3d.zeelex.me with build logs and process notes.",
    href: "https://3d.zeelex.me",
  },
  {
    title: "[Archive] Elliscope",
    oneLiner: "Autonomous hybrid airship HAPS — sensor fusion, telemetry, control systems.",
    tags: ["HAPS", "Autonomous Systems", "Python", "Hardware"],
    accentColor: "var(--accent-indigo)",
    status: "archived",
    imagePath: "/projects/airship.png",
    detail: "R&D project for a hybrid autonomous airship (High Altitude Platform System). Integrated hardware sensor arrays with Python-based telemetry and real-time flight control logic.",
    href: "https://elliscope.zeelex.me",
  },
]

const articles = [
  {
    title: "Recruiting is Broken. How Can We Fix It?",
    oneLiner: "An analytical look at modern IT hiring practices and rebuilding with accountability.",
    tags: ["Recruiting", "IT", "Processes", "Market"],
    accent: "#ec4899",
    status: "published",
    published: "2024-08-25",
    postSlug: "hiring-is-broken",
    languages: ["EN"],
    summary: "An analytical look at modern IT hiring practices. The model is broken at every layer — from phantom JDs to loop interviews that measure anxiety, not competence. This essay proposes concrete restructuring: structured scorecards, work-sample tests, and radical transport from status signaling to outcome alignment.",
  },
  {
    title: "Static Systems Are a Myth",
    oneLiner: "Digital systems constantly change — modeling helps predict when they'll become unstable.",
    tags: ["System Design", "Stability Analysis", "Dynamic Systems", "Scaling"],
    accent: "#06b6d4",
    status: "published",
    published: "2025-06-14",
    postSlug: "stat-systems",
    languages: ["EN", "RU"],
    summary: "Even your cache is a living system with feedback loops, nonlinear responses, and tipping points. Using dynamic systems theory and Lyapunov stability analysis, this essay models how seemingly 'static' infrastructure degrades and how to engineer early-warning observability into your stack.",
  },
  {
    title: "My Path in Mentorship",
    oneLiner: "From those who guided me to those I guide — what real mentorship looks like.",
    tags: ["Mentorship", "Personal Growth", "Career Path", "Learning"],
    accent: "#a855f7",
    status: "published",
    published: "2025-09-01",
    postSlug: "mentorship",
    languages: ["EN", "RU"],
    summary: "A personal reflection on the mentors who shaped my engineering career, and what I learned about guidance that is human, honest, and grounded in lived experience — not LinkedIn clichés.",
  },
  {
    title: "A Guide to Being Understood",
    oneLiner: "Stop throwing locked suitcases of jargon at people and learn to speak human.",
    tags: ["Communication", "Career Path", "Professional Development"],
    accent: "#84cc16",
    status: "published",
    published: "2025-09-29",
    postSlug: "how-to-explain",
    languages: ["EN", "RU"],
    summary: "Technical communication breakdown is the primary cause of failed projects — not bad code. This guide covers framing, audience modeling, and concrete techniques to bridge the gap between how engineers think and how humans receive information.",
  },
]

const sortedArticles = [...articles].sort((a, b) =>
  new Date(b.published).getTime() - new Date(a.published).getTime()
)

/* ─── ISOMETRIC SVG PROJECT DECORATION ─────────────────────────── */

function IsoBox({ accent }: { accent: string }) {
  return (
    <svg width="52" height="44" viewBox="0 0 52 44" fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" className="opacity-60 flex-shrink-0">
      {/* Top face */}
      <path d="M26 2L50 15V15L26 28L2 15V15L26 2Z" fill={`${accent}18`} stroke={`${accent}55`} strokeWidth="1" />
      {/* Left face */}
      <path d="M2 15L26 28V42L2 29V15Z" fill={`${accent}0d`} stroke={`${accent}44`} strokeWidth="1" />
      {/* Right face */}
      <path d="M50 15L26 28V42L50 29V15Z" fill={`${accent}22`} stroke={`${accent}55`} strokeWidth="1" />
    </svg>
  )
}

/* ─── HERO IDENTITY DIALOG ─────────────────────────────────────── */

function HeroMascotDialog() {
  const statusConfig = WORK_STATUS_CONFIG[CURRENT_WORK_STATUS];

  return (
    <div className="flex items-start gap-4 md:gap-8 mt-2 md:mt-8 mb-12 md:mb-16 animate-fade-up">
      {/* Left: Mascot & Socials */}
      <div className="flex flex-col items-center gap-3 md:gap-5 flex-shrink-0 pt-0 md:pt-4">
        <div className="relative">
          <div className="block md:hidden">
            <Mascot size={64} />
          </div>
          <div className="hidden md:block">
            <Mascot size={100} />
          </div>
          {statusConfig.mascotLabel && (
            <div
              className="absolute -top-2 -right-4 md:-top-3 md:-right-6 text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.5)] rotate-12 z-10 transition-transform duration-500 hover:rotate-0 hover:scale-110"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                background: "var(--tx-accent)",
                color: "var(--bg-base)"
              }}
            >
              {statusConfig.mascotLabel}
            </div>
          )}
        </div>
        <nav className="flex flex-col md:flex-row items-center gap-2 mt-1 md:mt-0" aria-label="Social links">
          {socialLinks.map(({ icon: Icon, label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border transition-colors hover:brightness-125 hover:scale-105"
              style={{
                borderColor: "var(--bg-border-dim)",
                background: "var(--bg-elevated)",
                color: "var(--tx-muted)",
              }}
            >
              <Icon size={16} />
            </a>
          ))}
        </nav>
      </div>

      {/* Right: Dialog Bubble */}
      <div
        className="relative rounded-[20px] md:rounded-[24px] p-5 md:p-7 w-full max-w-[760px] transition-shadow duration-700"
        style={{
          background: "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)",
          border: "1px solid var(--bg-border)",
          boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 60px ${statusConfig.color}11`
        }}
      >
        {/* Triangle Pointer ALWAYS points left */}
        <div
          className="absolute top-[28px] md:top-[52px] -left-[8px] md:-left-[10px] w-4 h-4 md:w-5 md:h-5 -rotate-45"
          style={{ background: "var(--bg-elevated)", borderLeft: "1px solid var(--bg-border)", borderTop: "1px solid var(--bg-border)" }}
        />

        {/* Spoken text */}
        <div className="mb-5 md:mb-6">
          <p className="text-[13px] md:text-[14px] leading-relaxed" style={{ color: "var(--tx-primary)" }}>
            <span style={{ color: "var(--tx-secondary)" }}>&quot;</span>I make data pipelines go brrr — but with structure, math, and controlled chaos.
            Systems behave like living organisms: flows, impulses, feedback loops.
            Most engineers poke until it works. I analyze stability, find weak modes, and make
            the whole thing reliably chef&apos;s-kiss. <span style={{ color: "var(--tx-secondary)" }}>Need something unreasonable, but scientifically
              engineered not to explode?&quot;</span>
          </p>
        </div>

        {/* Footer: Identity, Status & CTA */}
        <div
          className="pt-5 md:pt-6 border-t"
          style={{ borderColor: "var(--bg-border-dim)" }}
        >
          {/* Author Info */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-5 md:mb-6">
            <h1 className="text-base md:text-lg font-semibold tracking-tight" style={{ color: "var(--tx-primary)" }}>
              Alexey Belochenko
            </h1>

            <div
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] uppercase font-mono tracking-widest"
              style={{
                background: "var(--bg-base)",
                borderColor: "var(--bg-border-dim)",
                color: "var(--tx-secondary)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusConfig.color, boxShadow: `0 0 6px ${statusConfig.color}` }} />
              {statusConfig.label}
            </div>

            <p className="w-full text-[10px] md:text-[11px] uppercase tracking-widest font-mono mt-0.5" style={{ color: "var(--tx-muted)" }}>
              Systems &amp; Data Engineer
            </p>
          </div>

          {/* Call to Action */}
          <Link
            href="/profile"
            className="flex items-center justify-center w-full gap-2 text-[11px] font-semibold uppercase tracking-wider px-6 py-2.5 rounded-[10px] border transition-all hover:scale-[1.01]"
            style={{
              borderColor: "var(--tx-accent)",
              background: "var(--tx-accent)11",
              color: "var(--tx-accent)",
              boxShadow: "0 4px 16px var(--tx-accent)22"
            }}
          >
            Explore Profile <ArrowUpRight size={15} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─── PAGE ──────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <main
      className="min-h-screen dot-grid"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div className="max-w-[1000px] mx-auto px-5 py-8 space-y-10">
        <HeroMascotDialog />

        {/* ══ SECTION: PROJECTS ══════════════════════════════════ */}
        <section aria-labelledby="projects-heading">
          <div className="flex items-center justify-between mb-4">
            <h2
              id="projects-heading"
              className="text-xs font-medium uppercase tracking-[0.18em]"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--tx-muted)",
              }}
            >
              // Projects &amp; Artifacts
            </h2>
            <span
              className="text-[10px]"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--tx-muted)",
              }}
            >
              permanent_section
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 w-[calc(100%+2.5rem)] -ml-5 px-5 sm:w-full sm:ml-0 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {projects.map((project, i) => (
              <BentoTile
                key={project.title}
                title={project.title}
                oneLiner={project.oneLiner}
                tags={project.tags}
                accentColor={project.accentColor}
                status={project.status}
                colSpan="w-[240px] sm:w-[280px] flex-none snap-start"
                layout="square-image"
                imagePath={project.imagePath}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}
              >
                {/* Overlay Content */}
                <div className="space-y-4">
                  <p>{project.detail}</p>
                  <div className="pt-2">
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-md border transition-colors hover:brightness-125"
                      style={{
                        background: "var(--bg-elevated)",
                        borderColor: "var(--bg-border)",
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        color: project.accentColor,
                      }}
                    >
                      <ArrowUpRight size={13} />
                      {project.href.replace(/https?:\/\//, "")}
                    </a>
                  </div>
                </div>
              </BentoTile>
            ))}

          </div>
        </section>

        {/* ══ SECTION: ARTICLES ══════════════════════════════════ */}
        <section aria-labelledby="articles-heading">
          <div className="flex items-center justify-between mb-4">
            <h2
              id="articles-heading"
              className="text-xs font-medium uppercase tracking-[0.18em]"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--tx-muted)",
              }}
            >
              // Articles &amp; Essays
            </h2>
            <span
              className="text-[10px]"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--tx-muted)",
              }}
            >
              {sortedArticles.length}_entries
            </span>
          </div>

          <div className="bento-grid">
            {sortedArticles.map((article, i) => {
              return (
                <BentoTile
                  key={article.postSlug}
                  title={article.title}
                  oneLiner={article.oneLiner}
                  tags={[...article.tags, ...article.languages.map((l) => `lang:${l}`)]}
                  accentColor={article.accent}
                  status={article.status}
                  publishedAt={article.published}
                  colSpan="col-12"
                  layout="horizontal"
                  className="animate-fade-up px-5 py-4"
                  style={{ animationDelay: `${0.1 + i * 0.07}s` } as React.CSSProperties}
                >
                  {/* Article overlay detail */}
                  <div className="space-y-4">
                    <p>{article.summary}</p>
                    <Link
                      href={`/posts/${article.postSlug}`}
                      className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-md border transition-colors"
                      style={{
                        borderColor: `${article.accent}44`,
                        color: article.accent,
                        background: `${article.accent}0e`,
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                      }}
                    >
                      <ArrowUpRight size={13} />
                      Read Full Article
                    </Link>
                  </div>
                </BentoTile>
              )
            })}
          </div>
        </section>

        {/* ══ FOOTER ══════════════════════════════════════════════ */}
        <footer
          className="pt-6 pb-4 flex items-center justify-between border-t text-[10px]"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            borderColor: "var(--bg-border)",
            color: "var(--tx-muted)",
          }}
        >
          <span>© {new Date().getFullYear()} Alexey Belochenko</span>
          <span>// built with simplicity in mind</span>
        </footer>
      </div>
    </main>
  )
}
