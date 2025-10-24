import { getAllPosts, BlogList } from "cloudful-blog"
import path from "path";

export default function BlogPage() {
  const posts = getAllPosts(path.join(process.cwd(), "/public/blog")).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return <BlogList posts={posts} />;
}