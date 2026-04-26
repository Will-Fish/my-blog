import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getAllBlogTags } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "标签",
  description: "按标签浏览博客文章。",
};

export default async function BlogTagsPage() {
  const tags = await getAllBlogTags();

  return (
    <>
      <Header currentPath="/blog" />
      <main className="section-gap">
        <div className="page-shell">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-primary">标签</p>
            <h1 className="mt-3 font-serif text-5xl leading-tight">按话题浏览</h1>
            <p className="mt-5 text-lg leading-8 text-text-muted">从不同主题切入，快速找到你感兴趣的文章。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => (
              <Link key={tag.name} href={`/blog/tags/${encodeURIComponent(tag.name)}`}>
                <Card className="p-6 transition hover:-translate-y-1">
                  <div className="text-sm uppercase tracking-[0.16em] text-primary">标签</div>
                  <div className="mt-3 font-serif text-2xl">{tag.name}</div>
                  <div className="mt-2 text-text-muted">{tag.count} 篇文章</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
