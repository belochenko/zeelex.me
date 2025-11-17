'use client'

import { Github, Twitter, Linkedin, Mail, ExternalLink, Menu, X, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useState } from 'react'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  const socialLinks = [
    { icon: Github, label: "GitHub", url: "https://github.com", color: "hover:text-white" },
    { icon: Twitter, label: "Twitter", url: "https://twitter.com", color: "hover:text-blue-400" },
    { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com/in/example", color: "hover:text-blue-500" },
    { icon: Mail, label: "Email", url: "mailto:example@email.com", color: "hover:text-amber-400" },
  ]

  const projects = [
    {
      title: "Mobile App",
      description: "A cross-platform mobile application built with Flutter and Firebase.",
      tags: ["Flutter", "Dart", "Firebase"],
    },
    {
      title: "Web Dashboard",
      description: "A responsive admin dashboard built with Next.js and TailwindCSS.",
      tags: ["Next.js", "React", "TailwindCSS"],
    },
  ]

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
      `}</style>
      
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Hidden on mobile, visible on tablet+ */}
        <aside className="lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-1/3 lg:max-w-md bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-800 p-8 flex flex-col overflow-y-auto animate-fade-in-up">
          {/* Header Section */}
          <section className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-2xl font-mono flex-shrink-0">
                AB
              </div>
              <div>
                <h1 className="text-2xl font-bold font-mono leading-tight">Alexey Belochenko</h1>
                <p className="text-zinc-400 font-mono text-sm">Mobile Apps and Frontend Engineer</p>
              </div>
            </div>
          </section>

          <Separator className="bg-zinc-800 mb-8" />

          {/* About Section */}
          <section className="space-y-4 mb-8">
            <h2 className="text-lg font-bold font-mono flex items-center">
              <span className="text-emerald-400 mr-2">{">"}</span> About Me
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              I'm a passionate Mobile App and Front End Engineer with expertise in building cross-platform mobile applications and modern web interfaces. I specialize in Flutter, React, TypeScript, and Next.js.
            </p>
            <a 
              href="/resume.pdf" 
              download 
              className="inline-flex items-center gap-2 mt-4 px-3 py-2 bg-emerald-400/10 border border-emerald-400/30 rounded text-emerald-400 hover:bg-emerald-400/20 transition-colors text-sm font-mono"
            >
              <Download size={16} />
              Download Resume
            </a>
          </section>

          <Separator className="bg-zinc-800 mb-8" />

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

          <div className="mt-auto pt-8">
            <footer className="text-zinc-500 text-xs">
              <p>© {new Date().getFullYear()} Alexey Belochenko.</p>
              <p className="font-mono mt-2">{"// Built with Next.js"}</p>
            </footer>
          </div>
        </aside>

        {/* Right Content Area */}
        <section className="w-full lg:fixed lg:left-1/3 lg:right-0 lg:top-0 lg:h-screen lg:overflow-y-auto bg-zinc-950 p-6 md:p-8 pt-6 md:pt-12">
          <div className="max-w-2xl">
            {/* Skills Section */}
            <div className="space-y-4 mb-12 animate-fade-in-up stagger-1">
              <h2 className="text-xl font-bold font-mono flex items-center">
                <span className="text-emerald-400 mr-2">{">"}</span> Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30">
                  Flutter
                </Badge>
                <Badge variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30">
                  Dart
                </Badge>
                <Badge variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30">
                  Firebase
                </Badge>
                <Badge variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30">
                  React
                </Badge>
                <Badge variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30">
                  Next.js
                </Badge>
                <Badge variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30">
                  TypeScript
                </Badge>
                <Badge variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30">
                  JavaScript
                </Badge>
                <Badge variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30">
                  TailwindCSS
                </Badge>
                <Badge variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30">
                  REST API
                </Badge>
                <Badge variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30">
                  Git
                </Badge>
              </div>
            </div>

            <Separator className="bg-zinc-800 mb-12" />

            {/* Projects Section */}
            <div className="space-y-4 mb-12">
              <h2 className="text-xl font-bold font-mono flex items-center animate-fade-in-up stagger-2">
                <span className="text-emerald-400 mr-2">{">"}</span> Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {projects.map((project, index) => (
                  <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors animate-fade-in-up" style={{ animationDelay: `${0.3 + (index + 1) * 0.1}s` }}>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-bold text-zinc-100">{project.title}</h3>
                      <p className="text-zinc-400 text-sm">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="gap-1 mt-2">
                        <ExternalLink size={14} />
                        View Project
                      </Button>
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
