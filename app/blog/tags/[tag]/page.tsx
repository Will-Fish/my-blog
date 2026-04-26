import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/BlogCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getAllBlogTags, getPostsByTag } from "@/lib/markdown";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  const tags = await getAllBlogTags();
  return tags.map((tag) => ({ tag: tag.name }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;

  return {
    title: `标签：${tag}`,
    description: `查看所有与“${tag}”相关的文章。`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <>
      <Header currentPath="/blog" />
      <main className="section-gap">
        <div className="page-shell">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-primary">标签</p>
            <h1 className="mt-3 font-serif text-5xl leading-tight">{tag}</h1>
            <p className="mt-5 text-lg leading-8 text-text-muted">共收录 {posts.length} 篇相关文章。</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} featured={index === 0} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
