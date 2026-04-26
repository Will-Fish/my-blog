/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Card } from "@/components/Card";
import type { ProjectEntry } from "@/lib/markdown";

type ProjectCardProps = {
  project: ProjectEntry;
  featured?: boolean;
  compact?: boolean;
};

export function ProjectCard({ project, featured = false, compact = false }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <Card className="overflow-hidden transition duration-300 group-hover:-translate-y-1">
        <div className={featured ? "grid gap-0 md:grid-cols-2" : ""}>
          <div className={featured ? "min-h-[320px]" : compact ? "aspect-[16/10]" : "aspect-[4/3]"}>
            <img
              src={project.coverImage}
              alt={project.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className={compact ? "p-5 md:p-6" : "p-6 md:p-8"}>
            <div className="mb-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary-soft px-3 py-1 text-xs uppercase tracking-[0.16em] text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className={compact ? "font-serif text-2xl leading-tight" : "font-serif text-3xl leading-tight"}>
              {project.title}
            </h3>
            <p className={compact ? "mt-3 text-[15px] leading-7 text-text-muted" : "mt-4 text-base leading-7 text-text-muted"}>
              {project.excerpt}
            </p>
            <div className="mt-6 text-sm uppercase tracking-[0.16em] text-primary">查看案例</div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
