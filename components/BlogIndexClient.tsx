"use client";

import { useMemo, useState } from "react";
import { BlogCard } from "@/components/BlogCard";
import type { BlogEntry, BlogTaxonomyItem } from "@/lib/markdown";

type BlogIndexClientProps = {
  posts: BlogEntry[];
  categories: BlogTaxonomyItem[];
};

export function BlogIndexClient({ posts, categories }: BlogIndexClientProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesQuery = !normalizedQuery || post.searchText.includes(normalizedQuery);
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [normalizedQuery, posts, selectedCategory]);

  const [featuredPost, ...remainingPosts] = filteredPosts;
  const compactPosts = remainingPosts.slice(0, 2);
  const gridPosts = remainingPosts.slice(2);

  return (
    <div className="space-y-10 md:space-y-12">
      <div className="grid gap-8 rounded-[32px] border border-border/80 bg-surface/82 p-6 card-shadow backdrop-blur-sm md:p-8 lg:grid-cols-[minmax(0,1.15fr)_280px]">
        <div className="max-w-3xl">
          <label htmlFor="blog-search" className="text-sm uppercase tracking-[0.18em] text-primary">
            全文搜索
          </label>
          <div className="mt-4 rounded-[24px] border border-border/80 bg-background/90 p-2">
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索标题、摘要或正文关键词"
              className="w-full rounded-[18px] bg-transparent px-4 py-3 text-base text-foreground outline-none placeholder:text-text-soft"
            />
          </div>
          <p className="mt-4 text-sm text-text-soft">
            {normalizedQuery || selectedCategory
              ? `当前找到 ${filteredPosts.length} 篇文章${selectedCategory ? ` · 分类：${selectedCategory}` : ""}`
              : `当前收录 ${posts.length} 篇文章`}
          </p>
        </div>

        <div>
          <div className="text-sm uppercase tracking-[0.18em] text-text-soft">分类</div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                selectedCategory === null
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background/90 text-text-muted hover:border-primary/40 hover:text-primary"
              }`}
            >
              全部
            </button>

            {categories.map((category) => (
              <button
                type="button"
                key={category.name}
                onClick={() =>
                  setSelectedCategory((current) => (current === category.name ? null : category.name))
                }
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  selectedCategory === category.name
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background/90 text-text-muted hover:border-primary/40 hover:text-primary"
                }`}
              >
                {category.name} · {category.count}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="space-y-6 md:space-y-8">
          {featuredPost ? (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.82fr)]">
              <BlogCard post={featuredPost} layout="homeFeatured" />
              {compactPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
                  {compactPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} layout="homeCompact" />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {gridPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {gridPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-border bg-surface/70 px-6 py-12 text-center text-text-muted">
          没有找到匹配的文章，试试更换关键词或分类。
        </div>
      )}
    </div>
  );
}
