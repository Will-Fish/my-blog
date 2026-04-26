import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "项目",
  description: "产品探索、工具开发、与个人实验项目集。",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <>
      <Header currentPath="/projects" />
      <main className="section-gap">
        <div className="page-shell">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-primary">项目</p>
            <h1 className="mt-3 font-serif text-5xl leading-tight">实用或无用的小东西</h1>
            <p className="mt-5 text-lg leading-8 text-text-muted">
              产品探索、工具开发、与个人实验项目集。
            </p>
          </div>
          <div className="grid gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} featured={index === 0} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
