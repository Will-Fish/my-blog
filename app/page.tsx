/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { BlogCard } from "@/components/BlogCard";
import { Card } from "@/components/Card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HomePhotographyPreview } from "@/components/HomePhotographyPreview";
import { ProjectCard } from "@/components/ProjectCard";
import { getPhotographyImages } from "@/lib/photography";
import { getAllPosts, getAllProjects } from "@/lib/markdown";

const profileRoles = [
  "产品经理",
  "Vibe Coder",
  "摄影师",
  "健身爱好者",
  "玩玩咖啡",
  "热爱户外运动",
  "吉他新手",
  "偶尔调酒",
];

export default async function HomePage() {
  const [projects, posts, galleryItems] = await Promise.all([
    getAllProjects(),
    getAllPosts(),
    getPhotographyImages(),
  ]);
  const [featuredPost, ...secondaryPosts] = posts;

  return (
    <>
      <Header currentPath="/" />
      <main>
        <section className="section-gap">
          <div className="page-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="max-w-2xl">
              <h1 className="font-serif text-6xl leading-[0.94] tracking-[-0.04em] text-foreground md:text-[7.5rem]">
                鱼尾猩
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-text-muted md:text-lg">
                {profileRoles.map((role, index) => (
                  <span key={role} className="inline-flex items-center">
                    {index > 0 ? <span className="mx-2 text-text-soft/60">·</span> : null}
                    <span className="whitespace-nowrap">{role}</span>
                  </span>
                ))}
              </p>
            </div>
            <Card className="overflow-hidden">
              <img src="/images/ui/hero.webp" alt="个人照片" className="h-[520px] w-full object-cover" />
            </Card>
          </div>
        </section>

        <section className="section-gap border-t border-border/80">
          <div className="page-shell">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-primary">一些小东西</p>
                <h2 className="mt-2 font-serif text-4xl">项目</h2>
              </div>
              <Link href="/projects" className="text-sm uppercase tracking-[0.16em] text-primary">
                查看全部
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {projects.slice(0, 2).map((project) => (
                <ProjectCard key={project.slug} project={project} compact />
              ))}
            </div>
          </div>
        </section>

        <section className="section-gap border-t border-border/80">
          <div className="page-shell">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-primary">学而不思则罔</p>
                <h2 className="mt-2 font-serif text-4xl">博客</h2>
              </div>
              <Link href="/blog" className="text-sm uppercase tracking-[0.16em] text-primary">
                阅读更多
              </Link>
            </div>
            {featuredPost ? (
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.82fr)]">
                <BlogCard post={featuredPost} layout="homeFeatured" />
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
                  {secondaryPosts.slice(0, 2).map((post) => (
                    <BlogCard key={post.slug} post={post} layout="homeCompact" />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="section-gap border-t border-border/80">
          <div className="page-shell">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-primary">许多一瞬，念念不忘</p>
                <h2 className="mt-2 font-serif text-4xl">摄影</h2>
              </div>
              <Link href="/gallery" className="text-sm uppercase tracking-[0.16em] text-primary">
                进入画廊
              </Link>
            </div>
            <HomePhotographyPreview images={galleryItems.slice(0, 6)} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
