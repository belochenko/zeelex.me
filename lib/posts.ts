import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { compile } from '@mdx-js/mdx'
import { visit } from 'unist-util-visit'

export interface PostMetadata {
  title: string
  date: string
  tags?: string[]
  tldr?: string
  summary?: string
  lang?: string
  translationOf?: string
}

export interface PostHeading {
  id: string
  level: number
  text: string
}

export interface Post {
  slug: string
  metadata: PostMetadata
  code: string
  headings: PostHeading[]
  translations: string[]
}

const postsDir = path.join(process.cwd(), 'content', 'posts')
const FILENAME_REGEX = /^(.*?)(?:\.([a-z]{2}))?\.mdx$/i
const DEFAULT_LANG = 'en'
const INLINE_MATH_REGEX = /\$(?!\$)([^$]+?)\$(?!\$)/g
const BLOCK_MATH_REGEX = /\$\$([\s\S]+?)\$\$/g

function escapeBraces(input: string) {
  return input.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')
}

function escapeAttribute(input: string) {
  return input.replace(/"/g, '&quot;')
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

function collectText(node: any): string {
  if (!node) return ''

  if (typeof node.value === 'string') {
    return node.value
  }

  if (Array.isArray(node.children)) {
    return node.children.map(collectText).join('')
  }

  return ''
}

async function compileMdx(content: string) {
  const withMath = content
    .replace(
      BLOCK_MATH_REGEX,
      // FIX 1: Remove the \[\ \] delimiters from the string passed to the latex prop.
      (_, expr) => `<MathBlock latex="${escapeAttribute(escapeBraces(expr.trim()))}" />`
    )
    .replace(
      INLINE_MATH_REGEX,
      // FIX 2: The regex is already capturing the content without the $, so this is okay.
      (_, expr) => `<MathInline latex="${escapeAttribute(escapeBraces(expr.trim()))}" />`
    )

  const headings: PostHeading[] = []
  const slugger = createSlugger()

  const headingPlugin = () => (tree: any) => {
    visit(tree, 'heading', (node: any) => {
      if (node.depth > 3) return
      const text = collectText(node)
      const id = slugger.slug(text || 'section')
      headings.push({
        id,
        level: node.depth,
        text,
      })

      node.data = node.data || {}
      node.data.hProperties = node.data.hProperties || {}
      node.data.id = id
      node.data.hProperties.id = id
    })
  }

  const compiled = await compile(withMath, {
    outputFormat: 'function-body',
    development: false,
    remarkPlugins: [headingPlugin],
  })

  return {
    code: String(compiled.value),
    headings,
  }
}

type ParsedFile = {
  baseSlug: string
  lang: string
  path: string
  fileName: string
}

function parseFileName(fileName: string): ParsedFile | null {
  const match = fileName.match(FILENAME_REGEX)
  if (!match) return null
  const baseSlug = match[1]
  const lang = match[2] || DEFAULT_LANG
  return {
    baseSlug,
    lang,
    path: path.join(postsDir, fileName),
    fileName,
  }
}

async function loadParsedFile(parsed: ParsedFile): Promise<Post | null> {
  try {
    const fileContent = await fs.readFile(parsed.path, 'utf-8')
    const { data, content } = matter(fileContent)
    const lang = (data.lang as string) || parsed.lang || DEFAULT_LANG
    const translationOf = (data.translationOf as string) || parsed.baseSlug

    const { code, headings } = await compileMdx(content)

    return {
      slug: parsed.baseSlug,
      metadata: {
        ...(data as PostMetadata),
        lang,
        translationOf,
      },
      code,
      headings,
      translations: [],
    }
  } catch (error) {
    console.error(`[v0] Failed to load post: ${parsed.fileName}`, error)
    return null
  }
}

function choosePreferred(files: ParsedFile[], lang?: string): ParsedFile | null {
  if (!files.length) return null
  if (lang) {
    const match = files.find((f) => f.lang === lang)
    if (match) return match
  }
  const en = files.find((f) => f.lang === 'en')
  if (en) return en
  return files[0]
}

export async function getPost(slug: string, lang?: string): Promise<Post | null> {
  try {
    const files = (await fs.readdir(postsDir))
      .map(parseFileName)
      .filter((f): f is ParsedFile => f !== null && f.baseSlug === slug)

    if (!files.length) {
      return null
    }

    const translations = Array.from(new Set(files.map((f) => f.lang)))
    const targetFile = choosePreferred(files, lang)
    if (!targetFile) return null

    const loaded = await loadParsedFile(targetFile)
    if (!loaded) return null

    return {
      ...loaded,
      translations,
    }
  } catch (error) {
    console.error(`[v0] Failed to load post: ${slug}`, error)
    return null
  }
}

export async function getAllPosts(preferredLang?: string): Promise<Post[]> {
  try {
    const files = (await fs.readdir(postsDir))
      .map(parseFileName)
      .filter((f): f is ParsedFile => f !== null)

    const grouped = files.reduce<Record<string, ParsedFile[]>>((acc, file) => {
      acc[file.baseSlug] = acc[file.baseSlug] || []
      acc[file.baseSlug].push(file)
      return acc
    }, {})

    const posts = await Promise.all(
      Object.values(grouped).map(async (group) => {
        const choice = choosePreferred(group, preferredLang)
        if (!choice) return null
        const translations = Array.from(new Set(group.map((f) => f.lang)))
        const loaded = await loadParsedFile(choice)
        if (!loaded) return null
        return {
          ...loaded,
          translations,
        }
      })
    )

    return posts.filter((post): post is Post => post !== null)
  } catch (error) {
    console.error('[v0] Failed to load posts', error)
    return []
  }
}
