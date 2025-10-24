import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import path from "path";
import { getAllPosts, getPostBySlug, BlogPost } from "cloudful-blog"

export async function generateStaticParams() {
  const posts = getAllPosts(path.join(process.cwd(), "/public/blog"));
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const { frontmatter, content } = getPostBySlug(path.join(process.cwd(), "/public/blog"), slug);

  return (
    <PageContainer title={frontmatter.title} description={frontmatter.excerpt}>
      <Container sx={{ mt: 0 }}>
        <BlogPost frontmatter={frontmatter} content={content} />
      </Container>
    </PageContainer>
 )
}