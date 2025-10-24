import Link from 'next/link'
import { Typography, Card, CardContent, Stack, Divider } from '@mui/material'
import { getAllPosts } from '@/lib/mdx'

export default function BlogPage() {
  const posts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <Stack spacing={2}>
      <Typography variant="h2" sx={{mb:2}}>Product Updates</Typography>
      <Divider sx={{ mb: 2 }} />
      {posts.map((post) => (
        <Card key={post.slug} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5">{post.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(`${post.date}T00:00:00`).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{post.summary}</Typography>
            <Link href={`/blog/${post.slug}`}>Read more →</Link>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
