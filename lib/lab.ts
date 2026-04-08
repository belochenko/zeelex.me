import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { compile } from '@mdx-js/mdx'
import { visit } from 'unist-util-visit'
import remarkGfm from 'remark-gfm'

export interface LabMetadata {
  title: string
  date: string
  topic?: string
  difficulty?: string
  tags?: string[]
  summary?: string
}

export interface LabHeading {
  id: string
  level: number
  text: string
}

export interface LabPost {
  slug: string
  metadata: LabMetadata
  code: string
  headings: LabHeading[]
}

const labDir = path.join(process.cwd(), 'content', 'lab')
const FILENAME_REGEX = /^(.*?)\.mdx$/i
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
      (_, expr) => `<MathBlock latex="${escapeAttribute(escapeBraces(expr.trim()))}" />`
    )
    .replace(
      INLINE_MATH_REGEX,
      (_, expr) => `<MathInline latex="${escapeAttribute(escapeBraces(expr.trim()))}" />`
    )

  const headings: LabHeading[] = []
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
    remarkPlugins: [headingPlugin, remarkGfm],
  })

  return {
    code: String(compiled.value),
    headings,
  }
}

type ParsedFile = {
  slug: string
  path: string
  fileName: string
}

function parseFileName(fileName: string): ParsedFile | null {
  const match = fileName.match(FILENAME_REGEX)
  if (!match) return null
  return {
    slug: match[1],
    path: path.join(labDir, fileName),
    fileName,
  }
}

async function loadParsedFile(parsed: ParsedFile): Promise<LabPost | null> {
  try {
    const fileContent = await fs.readFile(parsed.path, 'utf-8')
    const { data, content } = matter(fileContent)

    const { code, headings } = await compileMdx(content)

    return {
      slug: parsed.slug,
      metadata: data as LabMetadata,
      code,
      headings,
    }
  } catch (error) {
    console.error(`[v0] Failed to load lab post: ${parsed.fileName}`, error)
    return null
  }
}

export async function getLabPost(slug: string): Promise<LabPost | null> {
  try {
    const files = (await fs.readdir(labDir))
      .map(parseFileName)
      .filter((f): f is ParsedFile => f !== null && f.slug === slug)

    if (!files.length) return null

    return await loadParsedFile(files[0])
  } catch (error) {
    console.error(`[v0] Failed to load lab post: ${slug}`, error)
    return null
  }
}

export async function getAllLabPosts(): Promise<LabPost[]> {
  try {
    // Ensure dir exists
    await fs.mkdir(labDir, { recursive: true })
    
    const files = (await fs.readdir(labDir))
      .map(parseFileName)
      .filter((f): f is ParsedFile => f !== null)

    const posts = await Promise.all(files.map(loadParsedFile))
    return posts.filter((post): post is LabPost => post !== null)
  } catch (error) {
    console.error('[v0] Failed to load lab posts', error)
    return []
  }
}
