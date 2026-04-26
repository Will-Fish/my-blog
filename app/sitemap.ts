import type { MetadataRoute } from "next";
import { getAllBlogCategories, getAllBlogTags, getAllPosts, getAllProjects } from "@/lib/markdown";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, tags, categories] = await Promise.all([
    getAllPosts(),
    getAllProjects(),
    getAllBlogTags(),
    getAllBlogCategories(),
  ]);

  return [
    "/",
    "/blog",
    "/blog/tags",
    "/blog/categories",
    "/projects",
    "/gallery",
  ].map((url) => ({
    url: absoluteUrl(url),
  })).concat(
    posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.date })),
    projects.map((project) => ({ url: absoluteUrl(`/projects/${project.slug}`) })),
    tags.map((tag) => ({ url: absoluteUrl(`/blog/tags/${encodeURIComponent(tag.name)}`) })),
    categories.map((category) => ({
      url: absoluteUrl(`/blog/categories/${encodeURIComponent(category.name)}`),
    })),
  );
}
