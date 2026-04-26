import contentIndexData from "@/generated/content-index.json";

export type Heading = {
  id: string;
  level: number;
  text: string;
};

type BaseEntry = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  content: string;
  html: string;
  headings: Heading[];
  searchText: string;
  draft: boolean;
};

export type ProjectEntry = BaseEntry & {
  client: string;
  role: string;
  timeline: string;
  users: string;
  tags: string[];
  tools: string[];
  metricOneValue: string;
  metricOneLabel: string;
  metricTwoValue: string;
  metricTwoLabel: string;
};

export type BlogEntry = BaseEntry & {
  category: string;
  date: string;
  readingTime: string;
  tags: string[];
};

export type BlogTaxonomyItem = {
  name: string;
  slug: string;
  count: number;
};

type ContentIndex = {
  posts: BlogEntry[];
  postsIncludingDrafts: BlogEntry[];
  projects: ProjectEntry[];
};

const contentIndex = contentIndexData as ContentIndex;

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getAllProjects(): Promise<ProjectEntry[]> {
  return contentIndex.projects;
}

export async function getProjectBySlug(slug: string) {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getAllPosts(options?: { includeDrafts?: boolean }): Promise<BlogEntry[]> {
  return options?.includeDrafts ? contentIndex.postsIncludingDrafts : contentIndex.posts;
}

export async function getPostBySlug(slug: string, options?: { includeDrafts?: boolean }) {
  const posts = await getAllPosts(options);
  return posts.find((post) => post.slug === slug);
}

export async function getAdjacentPosts(slug: string) {
  const posts = await getAllPosts();
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  return {
    previous: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    next: currentIndex > 0 ? posts[currentIndex - 1] : null,
  };
}

function toTaxonomyItems(values: string[]) {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({
      name,
      slug: createSlug(name) || encodeURIComponent(name),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-Hans-CN"));
}

export async function getAllBlogTags(): Promise<BlogTaxonomyItem[]> {
  const posts = await getAllPosts();
  return toTaxonomyItems(posts.flatMap((post) => post.tags));
}

export async function getAllBlogCategories(): Promise<BlogTaxonomyItem[]> {
  const posts = await getAllPosts();
  return toTaxonomyItems(posts.map((post) => post.category).filter(Boolean));
}

export async function getPostsByTag(tag: string) {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

export async function getPostsByCategory(category: string) {
  const posts = await getAllPosts();
  return posts.filter((post) => post.category === category);
}
