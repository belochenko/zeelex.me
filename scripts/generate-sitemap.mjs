import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const SITE_URL = (process.env.SITE_URL || 'https://zeelex.me').replace(/\/$/, '')
const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'sitemap.xml')
const HOME_PAGE = path.join(process.cwd(), 'app', 'page.tsx')

const STATIC_PATHS = ['/']
const EXCLUDED_SLUGS = new Set(['mdx-showcase'])
const POST_FILENAME = /^(.*?)(?:\.([a-z]{2}))?\.mdx$/i

function toLastMod(date) {
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

async function readPostEntries() {
  const files = await fs.promises.readdir(POSTS_DIR)
  const entries = []

  for (const file of files) {
    const match = file.match(POST_FILENAME)
    if (!match) continue

    const [, slug, lang = 'en'] = match
    const fullPath = path.join(POSTS_DIR, file)
    let data = {}
    let lastmod = null
    try {
      const source = await fs.promises.readFile(fullPath, 'utf8')
      ;({ data } = matter(source))
      lastmod = data?.date ? toLastMod(data.date) : null
    } catch (error) {
      console.warn(`[sitemap] parsing issue in ${file}: ${error.message}`)
    }

    if (!lastmod) {
      try {
        const stats = await fs.promises.stat(fullPath)
        lastmod = stats.mtime.toISOString()
      } catch {
        // If stat also fails, we leave lastmod as null
      }
    }

    const isExcluded =
      EXCLUDED_SLUGS.has(slug) ||
      data?.draft === true ||
      data?.published === false ||
      data?.private === true ||
      data?.unlisted === true

    if (isExcluded) {
      console.log(`[sitemap] skipping ${file} (unpublished/technical)`)
      continue
    }

    entries.push({
      slug,
      lang,
      lastmod,
    })
  }

  return entries
}

async function readArtifactLinks() {
  try {
    const source = await fs.promises.readFile(HOME_PAGE, 'utf8')
    const matches = source.match(/href:\s*["'`](https?:\/\/[^"'`]+)["'`]/g) || []
    const links = matches
      .map((match) => {
        const urlMatch = match.match(/href:\s*["'`](https?:\/\/[^"'`]+)["'`]/)
        return urlMatch ? urlMatch[1].replace(/\/$/, '') : null
      })
      .filter((href) => href && /^https?:\/\/([a-z0-9-]+)\.zeelex\.me/i.test(href))

    return Array.from(new Set(links))
  } catch (error) {
    console.warn(`[sitemap] could not read artifact links: ${error.message}`)
    return []
  }
}

function buildUrlEntry(loc, lastmod) {
  const parts = [`  <url>`, `    <loc>${loc}</loc>`]
  if (lastmod) {
    parts.push(`    <lastmod>${lastmod}</lastmod>`)
  }
  parts.push(`  </url>`)
  return parts.join('\n')
}

async function generate() {
  const urls = []

  for (const route of STATIC_PATHS) {
    urls.push(buildUrlEntry(`${SITE_URL}${route}`, null))
  }

  const artifactLinks = await readArtifactLinks()
  for (const link of artifactLinks) {
    urls.push(buildUrlEntry(link, null))
  }

  const posts = await readPostEntries()
  const grouped = posts.reduce((acc, entry) => {
    acc[entry.slug] = acc[entry.slug] || []
    acc[entry.slug].push(entry)
    return acc
  }, {})

  for (const [slug, variants] of Object.entries(grouped)) {
    const lastmod =
      variants
        .map((item) => item.lastmod)
        .filter(Boolean)
        .sort()
        .pop() || null

    urls.push(buildUrlEntry(`${SITE_URL}/posts/${slug}`, lastmod))

    for (const variant of variants) {
      if (variant.lang === 'en') continue
      urls.push(
        buildUrlEntry(
          `${SITE_URL}/posts/${slug}?lang=${variant.lang}`,
          variant.lastmod || lastmod
        )
      )
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')

  await fs.promises.writeFile(OUTPUT_PATH, xml, 'utf8')
  console.log(`Sitemap generated at ${OUTPUT_PATH}`)
}

generate().catch((error) => {
  console.error('Failed to generate sitemap:', error)
  process.exitCode = 1
})
