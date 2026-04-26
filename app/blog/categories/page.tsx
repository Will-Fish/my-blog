import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getAllBlogCategories } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "分类",
  description: "按分类浏览博客文章。",
};

export default async function BlogCategoriesPage() {
  const categories = await getAllBlogCategories();

  return (
    <>
      <Header currentPath="/blog" />
      <main className="section-gap">
        <div className="page-shell">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-primary">分类</p>
            <h1 className="mt-3 font-serif text-5xl leading-tight">按主题归档</h1>
            <p className="mt-5 text-lg leading-8 text-text-muted">从更大的主题维度浏览文章集合。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.name} href={`/blog/categories/${encodeURIComponent(category.name)}`}>
                <Card className="p-6 transition hover:-translate-y-1">
                  <div className="text-sm uppercase tracking-[0.16em] text-primary">分类</div>
                  <div className="mt-3 font-serif text-2xl">{category.name}</div>
                  <div className="mt-2 text-text-muted">{category.count} 篇文章</div>
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
