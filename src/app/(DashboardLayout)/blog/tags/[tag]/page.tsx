import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import { getPostsByTag, BlogTagList } from "cloudful-blog"
import path from "path";

export default async function BlogTagPage(props: { params: Promise<{ tag: string }> }) {
    const { tag } = await props.params;
    const posts = getPostsByTag(path.join(process.cwd(), "/public/blog"), tag, true).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  return (
    <PageContainer title="Product Updates" description="Typing Help: Product Updates">
      <Container sx={{ mt: 0 }}>
      <BlogTagList posts={posts} blogRootUrl='/blog' title='Product Updates' tag={tag} showFullContent/>
      </Container>
    </PageContainer>
  );
}