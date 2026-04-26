/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/BlogCard";
import { Card } from "@/components/Card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TableOfContents } from "@/components/TableOfContents";
import { getAdjacentPosts, getAllPosts, getPostBySlug } from "@/lib/markdown";
import { absoluteUrl } from "@/lib/site";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "文章不存在",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`),
      publishedTime: post.date,
      images: [
        {
          url: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [absoluteUrl(`/blog/${post.slug}/opengraph-image`)],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [allPosts, adjacentPosts] = await Promise.all([getAllPosts(), getAdjacentPosts(slug)]);

  const relatedPosts = allPosts
    .filter((item) => item.slug !== post.slug)
    .sort((a, b) => {
      const aScore = a.tags.filter((tag) => post.tags.includes(tag)).length;
      const bScore = b.tags.filter((tag) => post.tags.includes(tag)).length;
      return bScore - aScore;
    })
    .slice(0, 2);

  return (
    <>
      <Header currentPath="/blog" />
      <main className="section-gap">
        <div className="page-shell">
          <div className="mx-auto max-w-[1140px]">
            <header className="mx-auto max-w-4xl text-center">
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.16em] text-primary">
                <Link
                  href={`/blog/categories/${encodeURIComponent(post.category)}`}
                  className="rounded-full bg-primary-soft px-3 py-1 transition hover:opacity-80"
                >
                  {post.category}
                </Link>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tags/${encodeURIComponent(tag)}`}
                    className="rounded-full bg-surface-muted px-3 py-1 text-text-muted transition hover:text-primary"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <h1 className="mt-6 font-serif text-4xl leading-[1.08] md:text-6xl">{post.title}</h1>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm uppercase tracking-[0.14em] text-text-soft">
                <span>{post.date}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>{post.readingTime}</span>
              </div>
            </header>

            <Card className="mx-auto mt-10 max-w-5xl overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="max-h-[620px] min-h-[280px] w-full object-cover"
              />
            </Card>

            <div className="article-reading article-flow mx-auto mt-10 max-w-5xl">
              <aside className="article-sidebar">
                <TableOfContents headings={post.headings} />
              </aside>

              <div className="article-lead">
                <div className="text-sm uppercase tracking-[0.16em] text-primary">导语</div>
                <p className="mt-4 text-lg leading-9 text-text-muted">{post.excerpt}</p>
              </div>

              <div dangerouslySetInnerHTML={{ __html: post.html }} />
              <div className="clear-both" />
            </div>

            {(adjacentPosts.previous || adjacentPosts.next) ? (
              <div className="mx-auto mt-14 max-w-4xl">
                <Card className="p-6 md:p-7">
                  <div className="text-sm uppercase tracking-[0.16em] text-text-soft">继续阅读</div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm">
                    {adjacentPosts.previous ? (
                      <Link
                        href={`/blog/${adjacentPosts.previous.slug}`}
                        className="block rounded-2xl bg-surface-muted px-4 py-4 leading-6 transition hover:text-primary"
                      >
                        上一篇：{adjacentPosts.previous.title}
                      </Link>
                    ) : null}
                    {adjacentPosts.next ? (
                      <Link
                        href={`/blog/${adjacentPosts.next.slug}`}
                        className="block rounded-2xl bg-surface-muted px-4 py-4 leading-6 transition hover:text-primary"
                      >
                        下一篇：{adjacentPosts.next.title}
                      </Link>
                    ) : null}
                  </div>
                </Card>
              </div>
            ) : null}

            {relatedPosts.length > 0 ? (
              <div className="mx-auto mt-20 max-w-5xl">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-primary">Related</div>
                    <h2 className="mt-2 font-serif text-3xl">相关文章</h2>
                  </div>
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {relatedPosts.map((relatedPost) => (
                    <BlogCard key={relatedPost.slug} post={relatedPost} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
