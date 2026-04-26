import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/BlogCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getAllBlogCategories, getPostsByCategory } from "@/lib/markdown";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const categories = await getAllBlogCategories();
  return categories.map((category) => ({ category: category.name }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  return {
    title: `分类：${category}`,
    description: `查看所有属于“${category}”分类的文章。`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = await getPostsByCategory(category);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <>
      <Header currentPath="/blog" />
      <main className="section-gap">
        <div className="page-shell">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-primary">分类</p>
            <h1 className="mt-3 font-serif text-5xl leading-tight">{category}</h1>
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
