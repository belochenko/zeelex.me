import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { Tokens } from 'marked'

marked.use({ mangle: false, headerIds: true })

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

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(postsDir, `${slug}.mdx`)
    const fileContent = await fs.readFile(filePath, 'utf-8')

    const { data, content } = matter(fileContent)

    const tokens = marked.lexer(content)
    const headingsSlugger = new marked.Slugger()
    const headings = tokens
      .filter((token): token is Tokens.Heading => token.type === 'heading' && token.depth <= 3)
      .map((token) => ({
        id: headingsSlugger.slug(token.text),
        level: token.depth,
        text: token.text,
      }))

    const slugger = new marked.Slugger()
    const htmlContent = marked.parse(content, {
      headerIds: true,
      mangle: false,
      slugger,
    }) as string

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

