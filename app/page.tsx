import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

function Divider({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`h-px w-full bg-zinc-800 ${className}`} />
}

export default function Home() {

  const socialLinks = [
    { icon: Github, label: "GitHub", url: "https://github.com/belochenko", color: "hover:text-white" },
    { icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/zeelexes/", color: "hover:text-blue-500" },
    { icon: Mail, label: "Email", url: "mailto:hi@zeelex.me", color: "hover:text-amber-400" },
  ]

  const artifacts = [
    {
      title: "Home 3D Printing",
      description: "Exploring 3D printing at home",
      href: "https://3d.zeelex.me",
      image: "/icon.jpg",
      type: "external",
    },
    {
      title: "[Archive] Elliscope",
      description: "Autonomous hybrid airship systems or HAPS",
      href: "https://elliscope.zeelex.me",
      image: "/preview_elliscope.png",
      type: "external",
    },
  ]

  const articles = [
    {
      title: "Recruiting is broken and not working. How can we fix it?",
      summary: "An analytical look at modern IT hiring practices and how to rebuild them with accountability.",
      tags: ["Recruiting", "IT", "Processes", "Market"],
      postSlug: "hiring-is-broken",
      published: "2024-08-25",
      hasRead: true,
      languages: ["EN"],
    },
    {
      title: "Static Systems Are a Myth: Even Your Cache Lives Its Own Life",
      summary: "Digital systems constantly change, and modeling helps predict when they’ll become unstable.",
      tags: ["System design", "Stability Analysis", "Dynamic Systems", "Scaling by Design"],
      postSlug: "stat-systems",
      published: "2025-06-14",
      hasRead: true,
      languages: ["EN", "RU"],
    },
    {
      title: "My Path in Mentorship: From Those Who Guided Me to Those I Guide",
      summary: "A brief reflection on how the mentors who shaped my journey taught me what real guidance is — human, honest, and grounded in lived experience.",
      tags: ["Mentorship", "Personal Growth", "Career Path", "Learning Journey", "Mentors Matter", "Self-reflection", "Professional Development"],
      postSlug: "mentorship",
      published: "2025-09-01",
      hasRead: true,
      languages: ["EN", "RU"],
    },
    {
      title: "A Guide to Being Understood",
      summary: "You think your fancy terminology makes you look smart? top throwing locked suitcases with words at people and learn how to actually speak human before you lose your audience entirely.",
      tags: ["Communication", "Career Path", "Self-reflection", "Professional Development"],
      postSlug: "how-to-explain",
      published: "2025-09-29",
      hasRead: true,
      languages: ["EN", "RU"],
    },
  ]

  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
  )

  const superpowerTeaser = [
    { label: "Systems Thinking", accent: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30" },
    { label: "Math & Science", accent: "bg-fuchsia-400/10 text-fuchsia-200 border-fuchsia-400/30" },
    { label: "Software Engineering", accent: "bg-cyan-400/10 text-cyan-200 border-cyan-400/30" },
    { label: "Infrastructure & Reliability", accent: "bg-amber-400/10 text-amber-200 border-amber-400/30" },

  ]

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex flex-col lg:flex-row">
        {/* Left Column */}
        <aside className="lg:w-1/3 xl:w-[30%] bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-800 p-8 flex flex-col animate-fade-in-up lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          {/* Header Section */}
          <section className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-2xl font-mono flex-shrink-0">
                AB
              </div>
              <div>
                <h1 className="text-2xl font-bold font-mono leading-tight">Alexey Belochenko</h1>
                <p className="text-zinc-400 font-mono text-sm">Software & Data Engineer · Mathematical Modeling & System Dynamics Focus</p>
              </div>
            </div>
          </section>
          <section className="mb-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-100 text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
              <span>Open for projects & fractional roles</span>
            </div>
          </section>

          <Divider className="mb-6" />

          {/* About Section */}
          <section className="space-y-4 mb-6">
            <h2 className="text-lg font-bold font-mono flex items-center">
              <span className="text-emerald-400 mr-2">{">"}</span> What I Do
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
            I make data pipelines go brrrr 🚂 — but with structure, math, and controlled chaos. I don’t trust “experience” — I trust models. Systems behave like living organisms: flows, impulses, feedback loops. Most engineers poke until it works. I analyze stability, find weak modes, and make the whole thing chef’s-kiss reliable. Need something unreasonable, but scientifically engineered not to explode?{" "}
              <span className="text-emerald-300 font-semibold underline decoration-emerald-500/60 underline-offset-4">
                Hit the button.
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
              {/* <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Skills:
              </span> */}
              {/* {superpowerTeaser.map((item) => (
                <Badge
                  key={item.label}
                  variant="outline"
                  className={`${item.accent} text-[11px] md:text-xs border text-left`}
                >
                  {item.label}
                </Badge>
              ))} */}
            </div>
            <div className="flex justify-center text-xs font-mono">
              <Link href="/profile">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 px-3 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/20"
                >
                  <ExternalLink size={12} />
                  Learn About Me
                </Button>
              </Link>
            </div>
          </section>

          <Divider className="mb-6" />

          {/* Connect Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold font-mono flex items-center">
              <span className="text-emerald-400 mr-2">{">"}</span> Connect
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900/70 border border-zinc-800 rounded text-zinc-300 hover:text-emerald-400 hover:border-emerald-400/30 transition-colors group"
                  >
                    <Icon size={18} />
                    <span className="font-mono text-sm">{link.label}</span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )
              })}
            </div>
          </section>

          {/* <Divider className="mb-8" /> */}

          <div className="mt-auto pt-8 hidden lg:block">
            <footer className="text-zinc-500 text-xs">
              <p>© {new Date().getFullYear()} Alexey Belochenko.</p>
              <p className="font-mono mt-2">{"// Built with simplicity in mind"}</p>
            </footer>
          </div>
        </aside>

        {/* Right Content Area */}
        <section className="w-full lg:w-7/12 xl:w-[55%] bg-zinc-950 p-6 md:p-8 pt-6 md:pt-12">
          <div className="max-w-4xl mx-auto">
            {/* Projects & Artifacts */}
            <div className="space-y-4 mb-12">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-mono flex items-center animate-fade-in-up stagger-2">
                  <span className="text-emerald-400 mr-2">{">"}</span> Projects & Artifacts
                </h2>
                <span className="text-sm text-zinc-500 font-mono flex items-center gap-1">
                  <span className="text-emerald-400"></span> Permanent Section
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {artifacts.map((artifact, index) => (
                  <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors animate-fade-in-up overflow-hidden" style={{ animationDelay: `${0.3 + (index + 1) * 0.1}s` }}>
                    <CardContent className="p-0">
                      <div className="relative h-40 w-full">
                        {artifact.image ? (
                          <div
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${artifact.image})` }}
                            role="img"
                            aria-label={artifact.title}
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800 flex items-center justify-center text-zinc-600 text-xs font-mono">
                            Preview Image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4 space-y-2">
                          <div className="text-sm text-emerald-400 font-mono flex items-center gap-2">
                            <span>📌</span>
                            <span>Permanent</span>
                          </div>
                          <h3 className="text-lg font-bold text-zinc-50">{artifact.title}</h3>
                          <p className="text-xs text-zinc-300 line-clamp-2">{artifact.description}</p>
                          {artifact.type === "internal" ? (
                            <Link href={artifact.href}>
                              <Button variant="outline" size="sm" className="w-full gap-1 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/20 font-mono text-xs">
                                <ExternalLink size={12} />
                                Visit {artifact.href}
                              </Button>
                            </Link>
                          ) : (
                            <a href={artifact.href} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="w-full gap-1 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/20 font-mono text-xs">
                                <ExternalLink size={12} />
                                {artifact.href.replace(/https?:\/\//, '')}
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <p className="text-zinc-400 text-xs font-mono">{artifact.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Articles & Essays */}
            <div className="space-y-4 mb-12">
              <h2 className="text-xl font-bold font-mono flex items-center animate-fade-in-up stagger-2">
                <span className="text-emerald-400 mr-2">{">"}</span> Articles & Essays
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {sortedArticles.map((article, index) => (
                    <Card
                      key={`article-${article.postSlug}-${index}`}
                      className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${0.4 + (index + 1) * 0.1}s` }}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                          <span>Langs: {article.languages?.join(" / ") || "EN"}</span>
                          <time>{article.published}</time>
                        </div>
                        <h3 className="font-bold text-zinc-100 text-lg">{article.title}</h3>
                        <p className="text-zinc-400 text-sm line-clamp-3">
                          {article.summary}
                        </p>
                        {article.tags && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {article.tags.map((tag, tagIndex) => (
                              <Badge
                                key={`article-tag-${tag || 'tag'}-${tagIndex}`}
                                variant="outline"
                                className="bg-zinc-900 text-emerald-400 border-emerald-400/30 text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <Link href={`/posts/${article.postSlug}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-1 mt-2 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/20 font-mono"
                          >
                            <ExternalLink size={14} />
                            Read Article
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
