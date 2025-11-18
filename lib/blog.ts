import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export interface BlogPostMetadata {
  title: string
  date: string
  tags: string[]
  tldr: string
}

export interface BlogPost {
  metadata: BlogPostMetadata
  content: string
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    
    // Parse frontmatter and markdown content
    const { data, content } = matter(fileContent)
    
    // Convert markdown to HTML with MathJax support
    const htmlContent = marked(content)
    
    return {
      metadata: data as BlogPostMetadata,
      content: htmlContent,
    }
  } catch (error) {
    console.error(`[v0] Failed to load blog post: ${slug}`, error)
    return null
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogsDir = path.join(process.cwd(), 'content', 'blog')
    const files = await fs.readdir(blogsDir)
    
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.mdx'))
        .map(file => getBlogPost(file.replace('.mdx', '')))
    )
    
    return posts.filter((post): post is BlogPost => post !== null)
  } catch (error) {
    console.error('[v0] Failed to load blog posts', error)
    return []
  }
}
