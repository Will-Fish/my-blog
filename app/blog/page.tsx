import type { Metadata } from "next";
import { BlogIndexClient } from "@/components/BlogIndexClient";
import { Card } from "@/components/Card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getAllBlogCategories, getAllPosts } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "博客",
  description: "记录产品、技术、设计与生活方式观察的长文与随笔。",
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getAllPosts(), getAllBlogCategories()]);

  return (
    <>
      <Header currentPath="/blog" />
      <main className="section-gap">
        <div className="page-shell">
          <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.22em] text-primary">博客</p>
              <h1 className="mt-3 font-serif text-5xl leading-[1.02] md:text-6xl">思考与输出</h1>
              <p className="mt-5 text-lg leading-8 text-text-muted">
                学而不思则罔，通过写作来整理思路、沉淀经验，做一些输出上的尝试与练习
              </p>
            </div>
            {/* <Card className="p-6 md:p-7">
              <div className="text-sm uppercase tracking-[0.18em] text-primary">Archive</div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <div className="text-3xl font-serif">{posts.length}</div>
                  <div className="mt-1 text-sm text-text-soft">已发布文章</div>
                </div>
                <div>
                  <div className="text-3xl font-serif">{categories.length}</div>
                  <div className="mt-1 text-sm text-text-soft">内容分类</div>
                </div>
              </div>
            </Card> */}
          </div>
          <BlogIndexClient posts={posts} categories={categories} />
        </div>
      </main>
      <Footer />
    </>
  );
}
