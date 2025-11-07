import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import { getAllPosts, BlogList } from "cloudful-blog"
import path from "path";

export default function BlogPage() {
  const posts = getAllPosts(path.join(process.cwd(), "/public/blog"), true).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  return (
    <PageContainer title="Product Updates" description="Typing Help: Product Updates" showTitle>
      <Container>
      <BlogList posts={posts} blogRootUrl='/blog' title='Product Updates' showFullContent/>
      </Container>
    </PageContainer>
  );
}