"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft, ExternalLink, MapPin, Clock3, Laptop,
  CheckCircle2, ShieldCheck, Layers, Compass, Hammer, FlaskConical
} from "lucide-react"
import { BentoTile } from "@/components/bento-tile"

/* ─── DATA ─────────────────────────────────────────────────────── */

const quickFacts = [
  { label: "Based in",    value: "Calgary, AB, Canada",                          icon: MapPin  },
  { label: "Availability", value: "MST / UTC-7",                                 icon: Clock3  },
  { label: "Engagement",  value: "Fractional Lead · R&D Consultant · Mentor",    icon: Laptop  },
]

const engagementModes = [
  {
    title: "Strategic Architecture",
    detail: "High-level system modeling, technical due diligence, and no-nonsense roadmaps.",
    icon: Compass,
    accent: "#06b6d4",
  },
  {
    title: "High-Performance Engineering",
    detail: "Production-grade pipelines, vectorization, and merciless incident drills.",
    icon: Hammer,
    accent: "#f97316",
  },
  {
    title: "Scientific R&D",
    detail: "De-risking complex domains through mathematical modeling and rapid prototyping.",
    icon: FlaskConical,
    accent: "#a855f7",
  },
]

const careerSnapshot = [
  "7+ years engineering mission-critical systems, bridging Scientific Computing and Enterprise Infrastructure.",
  "Founder experience leading R&D for autonomous aerial systems (Elliscope), integrating hardware sensors with Python telemetry.",
  "Optimized wind energy simulation pipelines on GPU clusters (GE Vernova), achieving 5–10× acceleration.",
  "Architected Airflow data pipelines for clinical trials (Trialing Health), slashing processing time by 67%.",
  "Orchestrated cloud migrations and disaster recovery plans for Fintech clients, reducing costs by up to 25%.",
  "Mentored 150+ engineers and introduced scientific rigor to development processes.",
]

const declarationOfStandards = [
  { title: "Calculated Risk",          desc: "Innovation requires control. I explore new domains through rigorous experimentation, ensuring client stability while pushing technical boundaries." },
  { title: "Data Over Intuition",      desc: "Every hypothesis is validated using applied mathematics and objective performance metrics. No guessing — only proofs." },
  { title: "Future-Proof Architecture", desc: "Solutions are designed for hyper-scale from day one. I build systems that survive real-world load and support tomorrow's growth." },
  { title: "Performance by Design",    desc: "Speed is a feature. I deliver measurable breakthroughs through algorithmic optimization and custom vectorization libraries." },
  { title: "Technical Debt Elimination", desc: "I systematically dismantle legacy inefficiencies. Clean code and simplified workflows unlock resources for rapid innovation." },
  { title: "Force Multiplication",     desc: "I don't just write code; I elevate teams. Having trained 150+ developers, I enforce standards that ensure collective competence." },
]

const coreStacks = [
  { category: "Languages & Core",       tech: ["Python (Scientific)", "Rust", "C++", "SQL"],                     accent: "#06b6d4", detail: "High-performance computing, vectorization, low-level optimization" },
  { category: "Cloud & Infrastructure", tech: ["AWS (S3, Lambda, EKS)", "Kubernetes", "Terraform", "Helm"],      accent: "#f97316", detail: "Serverless architecture, IaC, multi-region deployment" },
  { category: "Data Engineering",       tech: ["Apache Airflow", "Kafka", "Celery", "Spark", "DBT"],             accent: "#a855f7", detail: "Distributed pipelines, DAG optimization, real-time streaming" },
  { category: "MLOps & AI",             tech: ["MLFlow", "PyTorch", "Docker", "GitLab CI/CD"],                   accent: "#ec4899", detail: "Model serving, automated training workflows, containerization" },
  { category: "Observability",          tech: ["Grafana", "Prometheus", "Loki", "Promtail"],                      accent: "#84cc16", detail: "Full-stack monitoring, anomaly detection, incident management" },
  { category: "Data Storage",           tech: ["PostgreSQL", "ClickHouse", "Redis", "Iceberg/Delta"],            accent: "#10b981", detail: "Advanced modeling, OLAP/OLTP optimization, high-throughput storage" },
]

/* ─── ISOMETRIC DECORATION ──────────────────────────────────────── */

function IsoStack({ accent }: { accent: string }) {
  return (
    <svg width="40" height="38" viewBox="0 0 52 44" fill="none" aria-hidden="true" className="opacity-55 flex-shrink-0">
      <path d="M26 2L50 15L26 28L2 15L26 2Z" fill={`${accent}18`} stroke={`${accent}55`} strokeWidth="1"/>
      <path d="M2 15L26 28V42L2 29V15Z"   fill={`${accent}0d`} stroke={`${accent}44`} strokeWidth="1"/>
      <path d="M50 15L26 28V42L50 29V15Z" fill={`${accent}22`} stroke={`${accent}55`} strokeWidth="1"/>
    </svg>
  )
}

/* ─── PAGE ──────────────────────────────────────────────────────── */

export default function Profile() {
  return (
    <main
      className="min-h-screen dot-grid"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div className="max-w-[1200px] mx-auto px-5 py-8 space-y-10">

        {/* ══ HEADER ════════════════════════════════════════════ */}
        <header className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs transition-colors"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--tx-muted)",
            }}
          >
            <ArrowLeft size={13} />
            back to home
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div
              className="relative h-28 w-28 shrink-0 rounded-xl overflow-hidden"
              style={{ border: "1px solid #10b98133" }}
            >
              <Image
                src="/profile.jpeg"
                alt="Alexey Belochenko"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="space-y-2">
              <p
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "#10b981",
                }}
              >
                who I am &amp; how I work
              </p>
              <h1
                className="text-3xl sm:text-4xl font-semibold leading-tight"
                style={{ color: "var(--tx-primary)" }}
              >
                Alexey Belochenko
              </h1>
              <p className="text-sm" style={{ color: "var(--tx-secondary)" }}>
                Systems &amp; Data Engineer · Software Engineer
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {quickFacts.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px]"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      borderColor: "var(--bg-border)",
                      background: "var(--bg-surface)",
                      color: "var(--tx-muted)",
                    }}
                  >
                    <Icon size={10} style={{ color: "#10b981", opacity: 0.8 }} />
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p
            className="text-sm sm:text-base leading-relaxed max-w-2xl"
            style={{ color: "var(--tx-secondary)" }}
          >
            I model dynamic systems, build resilient platforms, and keep teams honest about failure modes.
            I don&apos;t build in a vacuum — I anchor scientific rigor in practical engineering to ensure theory
            withstands the friction of real-world production. My mandate: stabilize the noise, enforce
            observability, and ship the smallest proven step forward.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:hi@zeelex.me?subject=Let's talk"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "#10b981", color: "#050505" }}
            >
              Send me a brief
            </a>
            <a
              href="/Alexey-Belochenko-CV-START-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm border transition-colors"
              style={{
                borderColor: "var(--bg-border)",
                background: "var(--bg-surface)",
                color: "var(--tx-secondary)",
              }}
            >
              <ExternalLink size={13} />
              Download CV
            </a>
          </div>
        </header>

        {/* ══ ENGAGEMENT MODES ══════════════════════════════════ */}
        <section aria-labelledby="engagement-heading">
          <h2
            id="engagement-heading"
            className="text-xs font-medium uppercase tracking-[0.18em] mb-4"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--tx-muted)",
            }}
          >
            // Engagement Modes
          </h2>
          <div className="bento-grid">
            {engagementModes.map((mode) => {
              const Icon = mode.icon
              return (
                <BentoTile
                  key={mode.title}
                  title={mode.title}
                  oneLiner={mode.detail}
                  tags={[]}
                  accentColor={mode.accent}
                  status="available"
                  colSpan="col-4"
                  noOverlay
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} style={{ color: mode.accent }} />
                    <span>{mode.detail}</span>
                  </div>
                </BentoTile>
              )
            })}
          </div>
        </section>

        {/* ══ CAREER SNAPSHOT ════════════════════════════════════ */}
        <section aria-labelledby="career-heading">
          <h2
            id="career-heading"
            className="text-xs font-medium uppercase tracking-[0.18em] mb-4"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--tx-muted)",
            }}
          >
            // Career Snapshot
          </h2>
          <div
            className="tile col-12 animate-fade-up"
            style={{ background: "var(--bg-surface)", cursor: "default" }}
          >
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 p-2.5 rounded-lg border"
                style={{ background: "#10b98112", borderColor: "#10b98133" }}
              >
                <CheckCircle2 size={18} style={{ color: "#10b981" }} />
              </div>
              <ul className="space-y-2">
                {careerSnapshot.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm leading-relaxed flex items-start gap-2"
                    style={{ color: "var(--tx-secondary)" }}
                  >
                    <span style={{ color: "#10b98166", marginTop: "6px", fontSize: "8px" }}>●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ══ ENGINEERING DISCIPLINE ════════════════════════════ */}
        <section aria-labelledby="standards-heading">
          <h2
            id="standards-heading"
            className="text-xs font-medium uppercase tracking-[0.18em] mb-4"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--tx-muted)",
            }}
          >
            // Engineering Discipline
          </h2>
          <div className="bento-grid">
            {declarationOfStandards.map((item, i) => {
              const accents = ["#06b6d4", "#f97316", "#a855f7", "#ec4899", "#84cc16", "#10b981"]
              const accent = accents[i % accents.length]
              return (
                <BentoTile
                  key={item.title}
                  title={item.title}
                  oneLiner={item.desc}
                  tags={[]}
                  accentColor={accent}
                  colSpan={i % 3 === 0 ? "col-5" : i % 3 === 1 ? "col-7" : "col-12"}
                  noOverlay
                />
              )
            })}
          </div>
        </section>

        {/* ══ CORE STACKS ════════════════════════════════════════ */}
        <section aria-labelledby="stacks-heading">
          <h2
            id="stacks-heading"
            className="text-xs font-medium uppercase tracking-[0.18em] mb-4"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--tx-muted)",
            }}
          >
            // Core Stacks
          </h2>
          <div className="bento-grid">
            {coreStacks.map((stack, i) => (
              <BentoTile
                key={stack.category}
                title={stack.category}
                oneLiner={stack.detail}
                tags={stack.tech}
                accentColor={stack.accent}
                colSpan={i % 2 === 0 ? "col-7" : "col-5"}
                noOverlay
              >
                <div className="flex items-center gap-3">
                  <IsoStack accent={stack.accent} />
                  <div className="flex flex-wrap gap-1.5">
                    {stack.tech.map((t) => (
                      <span
                        key={t}
                        className="tag-pill"
                        style={{
                          borderColor: `${stack.accent}44`,
                          color: stack.accent,
                          background: `${stack.accent}0e`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </BentoTile>
            ))}
          </div>
        </section>

        {/* ══ CTA ════════════════════════════════════════════════ */}
        <section>
          <div
            className="tile col-12 text-center"
            style={{
              cursor: "default",
              background: "linear-gradient(135deg, #10b98114 0%, var(--bg-surface) 50%, #6366f114 100%)",
              borderColor: "#10b98122",
            }}
          >
            <div
              className="flex items-center justify-center gap-2 mb-2"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--tx-muted)",
                fontSize: "11px",
              }}
            >
              <span className="status-dot" style={{ background: "#10b981" }} />
              open_for_work.true
            </div>
            <h2
              className="text-xl sm:text-2xl font-semibold mb-2"
              style={{ color: "var(--tx-primary)" }}
            >
              Let&apos;s have a talk
            </h2>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "var(--tx-secondary)" }}>
              I&apos;d be delighted to learn about your product, and perhaps find where I can be of use.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="mailto:hi@zeelex.me?subject=Let's talk"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "#10b981", color: "#050505" }}
              >
                Start a Conversation
              </a>
              <a
                href="https://www.linkedin.com/in/zeelexes/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm border transition-colors"
                style={{
                  borderColor: "var(--bg-border)",
                  background: "var(--bg-elevated)",
                  color: "var(--tx-secondary)",
                }}
              >
                <ExternalLink size={13} />
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ════════════════════════════════════════════ */}
        <footer
          className="pb-4 flex items-center justify-between border-t pt-6 text-[10px]"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            borderColor: "var(--bg-border)",
            color: "var(--tx-muted)",
          }}
        >
          <span>© {new Date().getFullYear()} Alexey Belochenko</span>
          <Link href="/" className="hover:underline" style={{ color: "var(--tx-muted)" }}>
            ← back to home
          </Link>
        </footer>
      </div>
    </main>
  )
}
