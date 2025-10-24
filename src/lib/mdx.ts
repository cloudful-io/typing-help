import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(), '/public/blog')

export function getAllPosts() {
  const files = fs.readdirSync(postsDir)

  return files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, '')
    const fullPath = path.join(postsDir, filename)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || '1970-01-01',
      summary: data.summary || '',
    }
  })
}

export async function getPostBySlug(slug: string) {
  const filePath = path.join(postsDir, `${slug}.mdx`)
  const source = fs.readFileSync(filePath, 'utf8')
  const { content, data } = matter(source)
  
  return {
    frontmatter: data,
    content,
  }
}
