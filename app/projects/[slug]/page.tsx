/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TableOfContents } from "@/components/TableOfContents";
import { getAllProjects, getProjectBySlug } from "@/lib/markdown";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  return {
    title: project?.title ?? "项目详情",
    description: project?.excerpt,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Header currentPath="/projects" />
      <main className="section-gap">
        <div className="page-shell">
          <div className="mx-auto max-w-[1140px]">
            <header className="mx-auto max-w-4xl text-center">
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.16em] text-primary">
                <span className="rounded-full bg-primary-soft px-3 py-1">项目案例</span>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-muted px-3 py-1 text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mt-6 font-serif text-4xl leading-[1.08] md:text-6xl">{project.title}</h1>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm uppercase tracking-[0.14em] text-text-soft">
                <span>{project.timeline}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>{project.users}</span>
              </div>
            </header>

            <Card className="mx-auto mt-10 max-w-5xl overflow-hidden">
              <img
                src={project.coverImage}
                alt={project.title}
                className="h-[460px] w-full object-cover"
              />
            </Card>

            <div className="article-reading article-flow mx-auto mt-10 max-w-5xl">
              <aside className="article-sidebar">
                <TableOfContents headings={project.headings} />
              </aside>

              <div className="article-lead">
                <div className="text-sm uppercase tracking-[0.16em] text-primary">项目简介</div>
                <p className="mt-4 text-lg leading-9 text-text-muted">{project.excerpt}</p>
              </div>

              <div dangerouslySetInnerHTML={{ __html: project.html }} />
              <div className="clear-both" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
