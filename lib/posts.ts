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
}

export interface PostHeading {
  id: string
  level: number
  text: string
}

export interface Post {
  metadata: PostMetadata
  code: string
  headings: PostHeading[]
}

const postsDir = path.join(process.cwd(), 'content', 'posts')

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

  const compiled = await compile(content, {
    outputFormat: 'function-body',
    development: false,
    mdxOptions: {
      remarkPlugins: [headingPlugin],
    },
  })

  return {
    code: String(compiled.value),
    headings,
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(postsDir, `${slug}.mdx`)
    const fileContent = await fs.readFile(filePath, 'utf-8')

    const { data, content } = matter(fileContent)
    const { code, headings } = await compileMdx(content)

    return {
      metadata: data as PostMetadata,
      code,
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

