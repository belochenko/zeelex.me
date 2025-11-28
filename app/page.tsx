import { Github, Linkedin, Mail, ExternalLink, Download } from 'lucide-react'
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
      published: "2025-12-12",
      hasRead: true,
      languages: ["EN", "RU"],
    },
  ]

  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex flex-col lg:flex-row">
        {/* Left Column */}
        <aside className="lg:w-1/3 xl:w-[30%] bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-800 p-8 flex flex-col animate-fade-in-up">
          {/* Header Section */}
          <section className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-2xl font-mono flex-shrink-0">
                AB
              </div>
              <div>
                <h1 className="text-2xl font-bold font-mono leading-tight">Alexey Belochenko</h1>
                <p className="text-zinc-400 font-mono text-sm">Software & Data Engineer · Mathematical Modeling Focus</p>
              </div>
            </div>
          </section>

          <Divider className="mb-8" />

          {/* About Section */}
          <section className="space-y-4 mb-8">
            <h2 className="text-lg font-bold font-mono flex items-center">
              <span className="text-emerald-400 mr-2">{">"}</span> What I Do
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              I make data pipelines go brrrrr 🏎️... but with style and substance. Think of me as someone who doesn't just fix things – I dissect them like a curious kid with a new toy, throw math at them until they reveal their secrets, experiment wildly, and then make them chef's kiss perfect. Fast code is cool, but elegant, reliable, fast code that I built by breaking it 47 times first? Now we're talking. Need to ship something unreasonable? Hit the button and let's talk.
            </p>
            <div className="flex items-center gap-3 text-xs font-mono">
              <a
                href="mailto:hi@zeelex.me?subject=Let's%20build%20something"
                className="inline-flex items-center justify-center gap-2 px-2.5 py-1.5 bg-emerald-400/10 border border-emerald-400/30 rounded text-emerald-400 hover:bg-emerald-400/20 transition-colors w-full max-w-[180px]"
              >
                <Mail size={14} />
                Write Me
              </a>
              <div className="text-center text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                or
              </div>
              <button
                type="button"
                title="Not now, it is not ready"
                aria-disabled="true"
                disabled
                className="inline-flex items-center justify-center gap-2 px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-zinc-500 cursor-not-allowed w-full max-w-[180px]"
              >
                <Download size={14} />
                Get My Resume
              </button>
            </div>
          </section>

          <Divider className="mb-8" />

          {/* Skills Section */}
          <section className="space-y-4 mb-8">
            <h2 className="text-lg font-bold font-mono flex items-center">
              <span className="text-emerald-400 mr-2">{">"}</span> Superpowers
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="bg-zinc-900 text-emerald-400 border-emerald-400/30 text-xs md:text-sm"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </section>

          <Divider className="mb-8" />

          {/* Connect Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold font-mono flex items-center">
              <span className="text-emerald-400 mr-2">{">"}</span> Connect
            </h2>
            <div className="space-y-3">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-zinc-300 hover:text-emerald-400 transition-colors group"
                  >
                    <Icon size={18} />
                    <span className="font-mono text-sm">{link.label}</span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )
              })}
            </div>
          </section>

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
  const skills = [
    "Data Engineering",
    "Pipeline Architecture",
    "Cloud Infrastructure",
    "Performance Optimization",
    "Monitoring & Observability",
    "Mathematical Modeling",
    "DevOps & MLOps",
    "Engineering",
    "Systems Design",
    "Product Strategy",
    "3D Printing",
  ]
