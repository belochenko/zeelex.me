import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { Tokens } from 'marked'

marked.use({ mangle: false, gfm: true })
marked.setOptions({ langPrefix: 'hljs language-' })

export interface PostMetadata {
  title: string
  date: string
  tags: string[]
  tldr: string
}

export interface PostHeading {
  id: string
  level: number
  text: string
}

export interface Post {
  metadata: PostMetadata
  content: string
  headings: PostHeading[]
}

const postsDir = path.join(process.cwd(), 'content', 'posts')
const INLINE_MATH_REGEX = /\$(?!\$)([^$]+?)\$(?!\$)/g
const BLOCK_MATH_REGEX = /\$\$([\s\S]+?)\$\$/g

interface MathReplacement {
  placeholder: string
  html: string
}

function createPlaceholder(type: 'block' | 'inline', index: number) {
  return `[[MATH_${type.toUpperCase()}_${index}]]`
}

function extractMath(markdown: string) {
  const replacements: MathReplacement[] = []
  let index = 0

  const withBlockPlaceholders = markdown.replace(BLOCK_MATH_REGEX, (_, expression) => {
    const placeholder = createPlaceholder('block', index)
    replacements.push({
      placeholder,
      html: `<span class="math-block">\\[${expression.trim()}\\]</span>`,
    })
    index += 1
    return placeholder
  })

  const withInlinePlaceholders = withBlockPlaceholders.replace(INLINE_MATH_REGEX, (_, expression) => {
    const placeholder = createPlaceholder('inline', index)
    replacements.push({
      placeholder,
      html: `<span class="math-inline">\\(${expression.trim()}\\)</span>`,
    })
    index += 1
    return placeholder
  })

  return {
    content: withInlinePlaceholders,
    replacements,
  }
}

function restoreMath(html: string, replacements: MathReplacement[]) {
  return replacements.reduce((acc, replacement) => {
    return acc.split(replacement.placeholder).join(replacement.html)
  }, html)
}

function slugify(value: string | undefined | null): string {
  const normalized = String(value ?? '')
    .toLowerCase()
    .trim()

  if (!normalized) {
    return 'section'
  }

  return normalized.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') || 'section'
}

function createSlugger() {
  const occurrences = new Map<string, number>()

  return {
    slug(value: string) {
      const base = slugify(value)
      const count = occurrences.get(base) ?? 0
      occurrences.set(base, count + 1)
      return count > 0 ? `${base}-${count}` : base
    },
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(postsDir, `${slug}.mdx`)
    const fileContent = await fs.readFile(filePath, 'utf-8')

    const { data, content } = matter(fileContent)
    const { content: normalizedContent, replacements } = extractMath(content)
    const headings: PostHeading[] = []
    const slugger = createSlugger()

    const renderer = new marked.Renderer()
    renderer.heading = function (this: any, token: Tokens.Heading) {
      const plainText = token.text ?? ''
      const id = slugger.slug(plainText)

      if (token.depth <= 3) {
        headings.push({
          id,
          level: token.depth,
          text: plainText,
        })
      }

      const innerHtml = this.parser.parseInline(token.tokens ?? [])
      return `<h${token.depth} id="${id}">${innerHtml}</h${token.depth}>`
    }

    const rawHtmlContent = marked.parse(normalizedContent, {
      renderer,
    }) as string
    const htmlContent = restoreMath(rawHtmlContent, replacements)

    return {
      metadata: data as PostMetadata,
      content: htmlContent,
      headings,
    }
  } catch (error) {
    console.error(`[v0] Failed to load post: ${slug}`, error)
    return null
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const files = await fs.readdir(postsDir)

    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => getPost(file.replace('.mdx', '')))
    )

    return posts.filter((post): post is Post => post !== null)
  } catch (error) {
    console.error('[v0] Failed to load posts', error)
    return []
  }
}
