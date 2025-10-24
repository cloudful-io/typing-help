import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Typography, Divider, Box, Stack } from '@mui/material'
import Link from 'next/link'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const { frontmatter, content } = await getPostBySlug(slug)

  return (
    <Stack spacing={2}>
      <Typography variant="h2" sx={{mb:2}}>Product Updates</Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h3" gutterBottom>{frontmatter.title}</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {new Date(`${frontmatter.date}T00:00:00`).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })}
      </Typography>
      <article className="prose">
        <MDXRemote source={content} />
      </article>
      <Box sx={{ mb: 3 }}>
        <Link href="/blog" style={{ textDecoration: 'none' }}>
          <Typography color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
            ← Back to Product Updates
          </Typography>
        </Link>
      </Box>
    </Stack>
  )
}
