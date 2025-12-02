import Link from "next/link"
import Image from "next/image"
import { ExternalLink, ArrowLeft, Compass, Hammer, FlaskConical, MapPin, Clock3, Laptop, CheckCircle2, ShieldCheck, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Profile() {
  const engagementModes = [
    {
      title: "Architecture & Leadership",
      detail: "Strategic direction, system modeling, and roadmap honesty.",
      icon: Compass,
    },
    {
      title: "Hands-On Engineering",
      detail: "Building pipelines, instrumentation, and incident drills.",
      icon: Hammer,
    },
    {
      title: "R&D / Incubation",
      detail: "Prototyping hard problems and de-risking with math.",
      icon: FlaskConical,
    },
  ]

  const declarationOfStandards = [
    {
      title: "Growth & Exploration",
      desc: "I actively seek new technical challenges, exploring new domains through controlled experimentation to manage client risk and ensure accountability."
    },
    {
      title: "Scientific Rigor",
      desc: "I leverage my applied mathematics background to validate every hypothesis using structured models and objective performance metrics, driving innovation."
    },
    {
      title: "Hyper-Scale Architecture",
      desc: "All solutions are fundamentally designed for long-term fault tolerance and scalability, ensuring today's work supports tomorrow's growth."
    },
    {
      title: "Performance Multipliers",
      desc: "I deliver measurable breakthroughs through optimization and custom libraries, achieving faster task execution."
    },
    {
      title: "Debt Elimination",
      desc: "I systematically drive technical transformation to eliminate technical debt and simplify workflows, unlocking resources for rapid innovation."
    },
    {
      title: "Mentorship and Knowledge Expansion",
      desc: "My commitment extends beyond self-improvement; I actively guide others, having trained over 150 developers, to ensure collective growth and competence."
    }
  ]

  const quickFacts = [
    { label: "Based in", value: "Barcelona, Spain", icon: MapPin },
    { label: "Time zone", value: "CET, UTC+1 (US/EU overlap)", icon: Clock3 },
    { label: "Formats", value: "Fractional, project, advisory", icon: Laptop },
  ]

  const careerSnapshot = [
    "7+ years building and running data platforms, observability, and reliability layers under constant change.",
    "Orchestrated critical Python upgrades and built custom vectorization libraries, resulting in 30% performance gains and a 40% reduction in compute time across complex services.",
    "Architected and implemented an Apache Airflow-based data pipeline, immediately reducing clinical trial data processing time by 67% (from 2 hours to 40 minutes).",
    "Led comprehensive code refactoring and implemented robust data validation/error handling, leading to a 66% reduction in system errors and enabling early production deployment.",
    "Partnered with founders and Developers to translate messy constraints into architectures that survive real-world load.",
    "Actively committed to knowledge sharing, serving as a Technical Mentor and training 153 developers, thereby contributing to improved team productivity and sustained growth."
  ]

  const coreStacks = [
    {
      category: "Programming Languages",
      tech: ["Python", "Rust", "C++", "Golang"],
      detail: "Orchestration, API dev (FastAPI, Django), Low-level optimization"
    },
    {
      category: "Cloud Computing (AWS Focus)",
      tech: ["S3", "Lambda", "VPC", "EC2", "RDS", "ELB", "Glue"],
      detail: "Infra migration, serverless systems, secure processing"
    },
    {
      category: "Data & Distributed Systems",
      tech: ["Airflow", "Kafka", "Spark", "Databricks", "DBT", "Pandas", "Celery"],
      detail: "Pipeline architecture, DAG refactoring, scalable data lakes"
    },
    {
      category: "DevOps / MLOps & Containerization",
      tech: ["Docker", "Kubernetes", "GitLab CI/CD", "Terraform", "MLFlow"],
      detail: "K8s microservices, CI/CD pipelines, IaC"
    },
    {
      category: "Reliability / Observability",
      tech: ["Grafana", "Loki", "Promtail", "Atlassian Suite"],
      detail: "Full-stack monitoring, performance tracking, incident mgmt"
    },
    {
      category: "Databases & Warehousing",
      tech: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Apache Doris", "Apache Druid"],
      detail: "Advanced data modeling, high-performance storage"
    },
    {
      category: "Data Formats & Structures",
      tech: ["Iceberg", "Parquet", "Delta", "Minio"],
      detail: "Modern lakehouse formats, object storage"
    }
  ]

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Header */}
        <header className="space-y-8">
          {/* Back Button - Mobile First */}
          <div className="flex justify-between items-center md:hidden">
            <Link href="/" className="inline-flex">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 -ml-2">
                <ArrowLeft size={16} className="mr-2" />
                Back Home
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-8 justify-between">
            <div className="space-y-6 max-w-3xl w-full">
              <p className="text-sm font-mono text-emerald-300 uppercase tracking-[0.3em]">Who I am and How I work</p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative h-32 w-32 shrink-0 rounded-full overflow-hidden ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-900/20">
                  <Image
                    src="/profile.jpeg"
                    alt="Alexey Belochenko Profile"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-bold font-mono leading-tight">Alexey Belochenko</h1>
                  <p className="text-zinc-400 text-lg">Systems & Data Engineer</p>
                  <div className="flex flex-wrap gap-2 text-sm text-zinc-500 font-mono">
                    {quickFacts.map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-1.5 bg-zinc-900/50 px-2 py-1 rounded border border-zinc-800">
                        <Icon size={12} className="text-emerald-400/70" />
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-zinc-200 text-base md:text-lg leading-relaxed max-w-2xl">
                I model dynamic systems, build reliable data platforms, and keep teams honest about failure modes.
                My goal: stabilize what’s noisy, make it observable, and ship the smallest proven step forward.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="mailto:hi@zeelex.me?subject=Let's talk" className="inline-flex">
                  <Button className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-6 h-11">
                    Send me a brief
                  </Button>
                </Link>
                <Link href="/cv.pdf" target="_blank" className="inline-flex">
                  <Button variant="outline" className="gap-2 bg-zinc-900 border-zinc-700 text-zinc-100 hover:border-emerald-400/40 h-11">
                    <ExternalLink size={14} />
                    Download CV
                  </Button>
                </Link>
              </div>
            </div>

            <Link href="/" className="hidden md:inline-flex">
              <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800">
                <ArrowLeft size={16} className="mr-2" />
                Back Home
              </Button>
            </Link>
          </div>
        </header>
        {/* Engagement Modes */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {engagementModes.map((mode) => (
            <Card
              key={mode.title}
              className="bg-zinc-950 border-zinc-800 hover:border-emerald-500/40 transition-colors border-dashed"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 bg-emerald-400/10 p-2 rounded-md">
                    <mode.icon size={18} />
                  </span>
                  <p className="font-bold text-zinc-100">{mode.title}</p>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{mode.detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Career Snapshot */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 mt-1">
              <CheckCircle2 className="text-emerald-400 h-6 w-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-300">Career Snapshot</h3>
              <ul className="space-y-2">
                {careerSnapshot.map((item, index) => (
                  <li key={index} className="text-zinc-300 text-sm leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-500/50 mt-1.5 text-[10px]">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Declaration of Standards */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 mt-1">
              <ShieldCheck className="text-emerald-400 h-6 w-6" />
            </div>
            <div className="space-y-4 w-full">
              <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-300">My Engineering Discipline</h3>
              <div className="space-y-4">
                {declarationOfStandards.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <h4 className="font-bold text-zinc-100 text-sm">{item.title}</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core Stacks */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 mt-1">
              <Layers className="text-emerald-400 h-6 w-6" />
            </div>
            <div className="space-y-6 w-full">
              <div className="space-y-1">
                <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-300">Core Stacks</h3>
                <p className="text-zinc-500 text-xs font-mono">{"// Tools of the trade"}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {coreStacks.map((stack) => (
                  <div key={stack.category} className="space-y-2">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-zinc-100 text-sm">{stack.category}</h4>
                      <p className="text-xs text-zinc-500">{stack.detail}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {stack.tech.map((tech) => (
                        <Badge key={tech} variant="secondary" className="bg-zinc-950 text-zinc-400 border-zinc-800 text-[10px] px-1.5 py-0 h-5 hover:text-emerald-300 hover:border-emerald-500/30 transition-colors">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-8 md:p-12 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">Let's have a talk I am always for something new</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            I would be delighted to learn more about your product, and perhaps we can find areas where I can be of assistance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="mailto:hi@zeelex.me?subject=Let's talk">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold">
                Start a Conversation
              </Button>
            </Link>
            <Link href="https://www.linkedin.com/in/zeelexes/" target="_blank">
              <Button variant="outline" size="lg" className="border-zinc-700 text-zinc-200 hover:bg-zinc-900">
                <ExternalLink size={16} className="mr-2" />
                LinkedIn
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
