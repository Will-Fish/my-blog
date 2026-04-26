/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Card } from "@/components/Card";
import type { BlogEntry } from "@/lib/markdown";

type BlogCardProps = {
  post: BlogEntry;
  featured?: boolean;
  layout?: "default" | "homeFeatured" | "homeCompact";
};

export function BlogCard({ post, featured = false, layout = "default" }: BlogCardProps) {
  if (layout === "homeFeatured") {
    return (
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <Card className="h-full overflow-hidden transition duration-300 group-hover:-translate-y-1">
          <div className="grid h-full gap-0 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
            <div className="relative min-h-[300px] overflow-hidden lg:min-h-[440px]">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/22 to-transparent" />
            </div>
            <div className="flex h-full flex-col justify-between p-6 md:p-8">
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-primary">
                  <span>{post.category}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span className="text-text-soft">{post.date}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span className="text-text-soft">{post.readingTime}</span>
                </div>
                <h3 className="mt-5 max-w-[12ch] font-serif text-3xl leading-[1.16] md:text-[2.6rem]">
                  {post.title}
                </h3>
                <p className="mt-5 max-w-xl text-[15px] leading-8 text-text-muted md:text-base">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm uppercase tracking-[0.16em] text-primary">
                <span>阅读全文</span>
                <span className="transition duration-300 group-hover:translate-x-1">↗</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (layout === "homeCompact") {
    return (
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <Card className="h-full overflow-hidden transition duration-300 group-hover:-translate-y-1">
          <div className="grid h-full gap-0 sm:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-1">
            <div className="aspect-[4/3] overflow-hidden lg:aspect-[16/10]">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex h-full flex-col p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-primary">
                <span>{post.category}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span className="text-text-soft">{post.readingTime}</span>
              </div>
              <h3 className="mt-4 font-serif text-[1.9rem] leading-[1.2]">{post.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-text-muted">{post.excerpt}</p>
              <div className="mt-5 text-sm uppercase tracking-[0.16em] text-primary">阅读全文</div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card
        className={`overflow-hidden transition duration-300 group-hover:-translate-y-1 ${
          featured ? "lg:col-span-2" : ""
        }`}
      >
        <div className={featured ? "grid gap-0 md:grid-cols-[1.1fr_0.9fr]" : ""}>
          <div className={featured ? "min-h-[320px]" : "aspect-[4/3]"}>
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex h-full flex-col p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-primary">
              <span>{post.category}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-text-soft">{post.date}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-text-soft">{post.readingTime}</span>
            </div>
            <h3 className="font-serif text-3xl leading-tight">{post.title}</h3>
            <p className="mt-4 flex-1 text-base leading-7 text-text-muted">{post.excerpt}</p>
            <div className="mt-6 text-sm uppercase tracking-[0.16em] text-primary">阅读全文</div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
