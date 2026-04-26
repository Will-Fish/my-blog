import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content");
const PUBLIC_ROOT = path.join(ROOT, "public");
const GENERATED_ROOT = path.join(ROOT, "generated");
const PHOTOGRAPHY_ROOT = path.join(CONTENT_ROOT, "photography");
const PHOTOGRAPHY_LARGE_ROOT = path.join(PHOTOGRAPHY_ROOT, "large");
const PHOTOGRAPHY_THUMB_ROOT = path.join(PHOTOGRAPHY_ROOT, "thumb");
const PUBLIC_PHOTOGRAPHY_ROOT = path.join(PUBLIC_ROOT, "photography");

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), "href", "title", "target", "rel"],
    img: [...(defaultSchema.attributes?.img ?? []), "src", "alt", "title", "loading", "decoding"],
    code: [...(defaultSchema.attributes?.code ?? []), "className"],
    pre: [...(defaultSchema.attributes?.pre ?? []), "className"],
    h1: [...(defaultSchema.attributes?.h1 ?? []), "id"],
    h2: [...(defaultSchema.attributes?.h2 ?? []), "id"],
    h3: [...(defaultSchema.attributes?.h3 ?? []), "id"],
    h4: [...(defaultSchema.attributes?.h4 ?? []), "id"],
    h5: [...(defaultSchema.attributes?.h5 ?? []), "id"],
    h6: [...(defaultSchema.attributes?.h6 ?? []), "id"],
  },
};

function splitList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toPlainText(node) {
  if (!node || typeof node !== "object") {
    return "";
  }

  if (typeof node.value === "string") {
    return node.value;
  }

  if (typeof node.alt === "string") {
    return node.alt;
  }

  if (!Array.isArray(node.children)) {
    return "";
  }

  return node.children.map((child) => toPlainText(child)).join("");
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function getReadingTime(frontmatterValue, plainText) {
  if (typeof frontmatterValue === "string" && frontmatterValue.trim()) {
    return frontmatterValue.trim();
  }

  const effectiveLength = plainText.replace(/\s+/g, "").length;
  const minutes = Math.max(1, Math.ceil(effectiveLength / 320));
  return `${minutes} 分钟阅读`;
}

function getExcerpt(frontmatterValue, plainText) {
  if (typeof frontmatterValue === "string" && frontmatterValue.trim()) {
    return frontmatterValue.trim();
  }

  return plainText.slice(0, 120).trim();
}

function isSafeUrl(value, allowMailto = false) {
  if (!value) {
    return false;
  }

  if (
    value.startsWith("/") ||
    value.startsWith("./") ||
    value.startsWith("../") ||
    value.startsWith("#") ||
    value.startsWith("?")
  ) {
    return true;
  }

  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return true;
    }

    return allowMailto && parsed.protocol === "mailto:";
  } catch {
    return false;
  }
}

function remarkSanitizeUrls() {
  return (tree) => {
    visit(tree, "link", (node) => {
      if (!node.url || !isSafeUrl(node.url, true)) {
        node.url = "#";
      }
    });

    visit(tree, "image", (node) => {
      if (!node.url || !isSafeUrl(node.url)) {
        node.url = "";
      }
    });
  };
}

async function compileMarkdown(content) {
  const parser = unified().use(remarkParse).use(remarkGfm);
  const tree = parser.parse(content);
  const slugger = new GithubSlugger();
  const headings = [];
  const textChunks = [];

  visit(tree, (node) => {
    const text = normalizeWhitespace(toPlainText(node));
    if (!text) {
      return;
    }

    if (node.type === "heading" && typeof node.depth === "number") {
      headings.push({
        id: slugger.slug(text),
        level: node.depth,
        text,
      });
      return;
    }

    if (node.type === "paragraph" || node.type === "text" || node.type === "listItem") {
      textChunks.push(text);
    }
  });

  const html = String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkSanitizeUrls)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeSanitize, sanitizeSchema)
      .use(rehypeStringify)
      .process(content),
  );

  return {
    html,
    headings,
    plainText: normalizeWhitespace(textChunks.join(" ")),
  };
}

function collectFilesRecursive(directory, predicate, baseDirectory = directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectFilesRecursive(absolutePath, predicate, baseDirectory));
      continue;
    }

    if (predicate(absolutePath)) {
      files.push(path.relative(baseDirectory, absolutePath));
    }
  }

  return files;
}

function defaultSlugFromFileName(fileName) {
  const normalized = fileName.replaceAll("\\", "/");
  const segments = normalized.split("/");
  const base = segments[segments.length - 1];

  if (base === "index.md") {
    return segments[segments.length - 2] ?? "";
  }

  return base.replace(/\.md$/, "");
}

function readMarkdownFiles(kind) {
  const directory = path.join(CONTENT_ROOT, kind);
  const markdownFiles = collectFilesRecursive(directory, (filePath) => filePath.endsWith(".md"));

  return markdownFiles.map((fileName) => {
    const raw = fs.readFileSync(path.join(directory, fileName), "utf8");
    const parsed = matter(raw);
    return {
      fileName,
      data: parsed.data,
      content: parsed.content.trim(),
    };
  });
}

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function getWebpDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);

  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
    return { width: 640, height: 480 };
  }

  const chunkType = buffer.toString("ascii", 12, 16);

  if (chunkType === "VP8X" && buffer.length >= 30) {
    return {
      width: 1 + readUInt24LE(buffer, 24),
      height: 1 + readUInt24LE(buffer, 27),
    };
  }

  if (chunkType === "VP8 " && buffer.length >= 30) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  if (chunkType === "VP8L" && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  return { width: 640, height: 480 };
}

function formatTitleFromFileName(relativePath) {
  const baseName = path.basename(relativePath, path.extname(relativePath));
  return baseName
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function syncPhotographyAssets() {
  fs.mkdirSync(PUBLIC_PHOTOGRAPHY_ROOT, { recursive: true });

  fs.cpSync(PHOTOGRAPHY_LARGE_ROOT, path.join(PUBLIC_PHOTOGRAPHY_ROOT, "large"), {
    recursive: true,
    force: true,
  });
  fs.cpSync(PHOTOGRAPHY_THUMB_ROOT, path.join(PUBLIC_PHOTOGRAPHY_ROOT, "thumb"), {
    recursive: true,
    force: true,
  });
}

async function buildContentIndex() {
  const [rawProjects, rawPosts] = await Promise.all([
    Promise.all(
      readMarkdownFiles("projects").map(async ({ fileName, data, content }) => {
        const compiled = await compileMarkdown(content);
        return {
          slug: String(data.slug ?? fileName.replace(/\.md$/, "")),
          title: String(data.title ?? ""),
          excerpt: getExcerpt(data.excerpt, compiled.plainText),
          coverImage: String(data.coverImage ?? ""),
          client: String(data.client ?? ""),
          role: String(data.role ?? ""),
          timeline: String(data.timeline ?? ""),
          users: String(data.users ?? ""),
          tags: splitList(data.tags),
          tools: splitList(data.tools),
          metricOneValue: String(data.metricOneValue ?? ""),
          metricOneLabel: String(data.metricOneLabel ?? ""),
          metricTwoValue: String(data.metricTwoValue ?? ""),
          metricTwoLabel: String(data.metricTwoLabel ?? ""),
          content,
          html: compiled.html,
          headings: compiled.headings,
          searchText: normalizeWhitespace(
            [data.title, data.excerpt, data.client, splitList(data.tags).join(" "), compiled.plainText]
              .filter(Boolean)
              .join(" "),
          ).toLowerCase(),
          draft: data.draft === true || data.draft === "true",
        };
      }),
    ),
    Promise.all(
      readMarkdownFiles("blog").map(async ({ fileName, data, content }) => {
        const compiled = await compileMarkdown(content);
        return {
          slug: String(data.slug ?? defaultSlugFromFileName(fileName)),
          title: String(data.title ?? ""),
          excerpt: getExcerpt(data.excerpt, compiled.plainText),
          coverImage: String(data.coverImage ?? ""),
          category: String(data.category ?? ""),
          date: String(data.date ?? ""),
          readingTime: getReadingTime(data.readingTime, compiled.plainText),
          tags: splitList(data.tags),
          content,
          html: compiled.html,
          headings: compiled.headings.filter((heading) => heading.level >= 2 && heading.level <= 3),
          searchText: normalizeWhitespace(
            [
              data.title,
              data.excerpt,
              data.category,
              splitList(data.tags).join(" "),
              compiled.plainText,
            ]
              .filter(Boolean)
              .join(" "),
          ).toLowerCase(),
          draft: data.draft === true || data.draft === "true",
        };
      }),
    ),
  ]);

  const projects = rawProjects
    .filter((project) => !project.draft)
    .sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN"));
  const postsIncludingDrafts = rawPosts.sort((a, b) => b.date.localeCompare(a.date));
  const posts = postsIncludingDrafts.filter((post) => !post.draft);

  return { posts, postsIncludingDrafts, projects };
}

function buildPhotographyManifest() {
  const thumbFiles = collectFilesRecursive(PHOTOGRAPHY_THUMB_ROOT, (filePath) => filePath.endsWith(".webp"));

  return thumbFiles
    .map((relativePath) => {
      const thumbAbsolutePath = path.join(PHOTOGRAPHY_THUMB_ROOT, relativePath);
      const largeAbsolutePath = path.join(PHOTOGRAPHY_LARGE_ROOT, relativePath);

      if (!fs.existsSync(largeAbsolutePath)) {
        return null;
      }

      const metadata = getWebpDimensions(thumbAbsolutePath);
      const normalizedPath = relativePath.split(path.sep).join("/");

      return {
        id: normalizedPath.replace(/\.webp$/i, ""),
        title: formatTitleFromFileName(relativePath),
        largeSrc: `/photography/large/${normalizedPath}`,
        thumbSrc: `/photography/thumb/${normalizedPath}`,
        width: metadata.width,
        height: metadata.height,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.id.localeCompare(b.id, "zh-Hans-CN"));
}

async function main() {
  syncPhotographyAssets();

  const [contentIndex, photographyManifest] = await Promise.all([
    buildContentIndex(),
    Promise.resolve(buildPhotographyManifest()),
  ]);

  writeJson(path.join(GENERATED_ROOT, "content-index.json"), contentIndex);
  writeJson(path.join(GENERATED_ROOT, "photography.json"), photographyManifest);

  console.log("Generated site data for Cloudflare Workers deployment.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
