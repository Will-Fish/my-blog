import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const BLOG_ROOT = path.join(ROOT, "content", "blog");
const PROJECTS_ROOT = path.join(ROOT, "content", "projects");
const PUBLIC_BLOG_ROOT = path.join(ROOT, "public", "blog");
const PUBLIC_PROJECTS_ROOT = path.join(ROOT, "public", "projects");
const PHOTOGRAPHY_ROOT = path.join(ROOT, "content", "photography");
const PHOTOGRAPHY_LARGE_ROOT = path.join(PHOTOGRAPHY_ROOT, "large");
const PHOTOGRAPHY_THUMB_ROOT = path.join(PHOTOGRAPHY_ROOT, "thumb");
const IMAGE_EXT_RE = /\.(jpe?g|png)$/i;

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function isLocalImageRef(value) {
  return (
    IMAGE_EXT_RE.test(value) &&
    !value.startsWith("http://") &&
    !value.startsWith("https://") &&
    !value.startsWith("data:") &&
    !value.startsWith("/")
  );
}

function collectFilesRecursive(dirPath, predicate) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectFilesRecursive(absolutePath, predicate));
      continue;
    }

    if (predicate(absolutePath)) {
      files.push(absolutePath);
    }
  }

  return files;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: raw };
  }

  const [, frontmatter, content] = match;
  const data = Object.fromEntries(
    frontmatter
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim();
        return [key, value.replace(/^['\"]|['\"]$/g, "")];
      }),
  );

  return { data, content };
}

function getPostSlug(markdownPath, frontmatterSlug) {
  if (frontmatterSlug && frontmatterSlug.trim()) {
    return frontmatterSlug.trim();
  }

  const name = path.basename(markdownPath, path.extname(markdownPath));
  if (name === "index") {
    return path.basename(path.dirname(markdownPath));
  }

  return name;
}

function splitResource(value) {
  const hashIndex = value.indexOf("#");
  const queryIndex = value.indexOf("?");
  const splitIndex =
    hashIndex === -1
      ? queryIndex
      : queryIndex === -1
        ? hashIndex
        : Math.min(hashIndex, queryIndex);

  if (splitIndex === -1) {
    return { pathPart: value, suffix: "" };
  }

  return {
    pathPart: value.slice(0, splitIndex),
    suffix: value.slice(splitIndex),
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function convertToWebp(sourcePath, destinationPath) {
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  await sharp(sourcePath).rotate().webp({ quality: 82, effort: 5 }).toFile(destinationPath);
}

async function convertPhotoVariant(sourcePath, destinationPath, width, quality) {
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  await sharp(sourcePath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(destinationPath);
}

function shouldProcessImage(sourcePath, destinationPath) {
  if (!fs.existsSync(destinationPath)) {
    return true;
  }

  const sourceStat = fs.statSync(sourcePath);
  const destinationStat = fs.statSync(destinationPath);
  return sourceStat.mtimeMs > destinationStat.mtimeMs;
}

function canRemoveOriginal(sourcePath, largeTargetPath, thumbTargetPath) {
  if (!fs.existsSync(sourcePath)) {
    return false;
  }

  return fs.existsSync(largeTargetPath) && fs.existsSync(thumbTargetPath);
}

function collectLocalReferences(markdownRaw) {
  const refs = new Set();

  for (const match of markdownRaw.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const target = match[1]?.trim().replace(/^<|>$/g, "");
    if (target && isLocalImageRef(target)) {
      refs.add(target);
    }
  }

  const coverMatch = markdownRaw.match(/^coverImage:\s*(.+)$/m);
  if (coverMatch) {
    const coverValue = coverMatch[1].trim().replace(/^['\"]|['\"]$/g, "");
    if (coverValue && isLocalImageRef(coverValue)) {
      refs.add(coverValue);
    }
  }

  return refs;
}

function collectReferencedImagePaths(markdownRaw) {
  const refs = new Set();

  for (const match of markdownRaw.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const target = match[1]?.trim().replace(/^<|>$/g, "");
    if (!target) {
      continue;
    }

    const { pathPart } = splitResource(target);
    refs.add(pathPart.replace(/^\.\//, ""));
  }

  const coverMatch = markdownRaw.match(/^coverImage:\s*(.+)$/m);
  if (coverMatch) {
    const coverValue = coverMatch[1].trim().replace(/^['\"]|['\"]$/g, "");
    if (coverValue) {
      const { pathPart } = splitResource(coverValue);
      refs.add(pathPart.replace(/^\.\//, ""));
    }
  }

  return refs;
}

async function processMarkdownFile(markdownPath) {
  const raw = fs.readFileSync(markdownPath, "utf8");
  const { data } = parseFrontmatter(raw);
  const slug = getPostSlug(markdownPath, typeof data.slug === "string" ? data.slug : "");
  const markdownDir = path.dirname(markdownPath);
  const isProjectMarkdown = markdownPath.startsWith(PROJECTS_ROOT);
  const publicRoot = isProjectMarkdown ? PUBLIC_PROJECTS_ROOT : PUBLIC_BLOG_ROOT;
  const publicBasePath = isProjectMarkdown ? "/projects" : "/blog";

  const conversionMap = new Map();
  const convertedSources = new Map();

  const assetDir = path.join(markdownDir, "assets");
  if (fs.existsSync(assetDir)) {
    const assetFiles = collectFilesRecursive(assetDir, (filePath) => IMAGE_EXT_RE.test(filePath));
    for (const sourcePath of assetFiles) {
      const baseName = path.basename(sourcePath, path.extname(sourcePath));
      const targetPath = path.join(publicRoot, slug, "assets", `${baseName}.webp`);
      await convertToWebp(sourcePath, targetPath);
      convertedSources.set(sourcePath, targetPath);

      const relativeSource = toPosix(path.relative(markdownDir, sourcePath));
      conversionMap.set(relativeSource, `${publicBasePath}/${slug}/assets/${baseName}.webp`);
    }
  }

  const localRefs = collectLocalReferences(raw);
  for (const ref of localRefs) {
    const { pathPart, suffix } = splitResource(ref);
    const normalizedPath = pathPart.replace(/^\.\//, "");

    if (conversionMap.has(normalizedPath)) {
      conversionMap.set(ref, `${conversionMap.get(normalizedPath)}${suffix}`);
      continue;
    }

    const sourcePath = path.resolve(markdownDir, pathPart);
    if (!fs.existsSync(sourcePath) || !IMAGE_EXT_RE.test(sourcePath)) {
      continue;
    }

    const baseName = path.basename(sourcePath, path.extname(sourcePath));
    const targetPath = path.join(publicRoot, slug, "assets", `${baseName}.webp`);
    await convertToWebp(sourcePath, targetPath);
    convertedSources.set(sourcePath, targetPath);
    conversionMap.set(ref, `${publicBasePath}/${slug}/assets/${baseName}.webp${suffix}`);
  }

  if (conversionMap.size === 0) {
    return { changed: false, removedOriginalCount: 0 };
  }

  let updated = raw;
  for (const [from, to] of conversionMap.entries()) {
    const escapedFrom = escapeRegExp(from);
    updated = updated.replace(
      new RegExp(`(!\\[[^\\]]*\\]\\()<?${escapedFrom}>?(\\s+"[^"]*")?\\)`, "g"),
      (_match, prefix, titlePart = "") => `${prefix}${to}${titlePart})`,
    );
    updated = updated.replace(
      new RegExp(`(^coverImage:\\s*)["']?${escapedFrom}["']?$`, "gm"),
      `$1${to}`,
    );
  }

  if (updated !== raw) {
    fs.writeFileSync(markdownPath, updated, "utf8");
  }

  const finalContent = updated;
  const referencedImagePaths = collectReferencedImagePaths(finalContent);
  let removedOriginalCount = 0;

  for (const [sourcePath, targetPath] of convertedSources.entries()) {
    if (!fs.existsSync(sourcePath) || !fs.existsSync(targetPath)) {
      continue;
    }

    const relativeToMarkdown = toPosix(path.relative(markdownDir, sourcePath));
    const normalizedRelative = relativeToMarkdown.replace(/^\.\//, "");
    if (referencedImagePaths.has(normalizedRelative)) {
      continue;
    }

    fs.unlinkSync(sourcePath);
    removedOriginalCount += 1;
    console.log(`removed original: ${toPosix(path.relative(ROOT, sourcePath))}`);
  }

  if (updated !== raw) {
    return { changed: true, removedOriginalCount };
  }

  return { changed: false, removedOriginalCount };
}

async function processPhotographyImages() {
  const sourceFiles = collectFilesRecursive(PHOTOGRAPHY_LARGE_ROOT, (filePath) =>
    IMAGE_EXT_RE.test(filePath),
  );

  let processedCount = 0;
  let removedOriginalCount = 0;

  for (const sourcePath of sourceFiles) {
    const relativePath = path.relative(PHOTOGRAPHY_LARGE_ROOT, sourcePath);
    const parsed = path.parse(relativePath);
    const webpRelativePath = path.join(parsed.dir, `${parsed.name}.webp`);
    const largeTargetPath = path.join(PHOTOGRAPHY_LARGE_ROOT, webpRelativePath);
    const thumbTargetPath = path.join(PHOTOGRAPHY_THUMB_ROOT, webpRelativePath);

    const needsLarge = shouldProcessImage(sourcePath, largeTargetPath);
    const needsThumb = shouldProcessImage(sourcePath, thumbTargetPath);

    if (!needsLarge && !needsThumb) {
      if (canRemoveOriginal(sourcePath, largeTargetPath, thumbTargetPath)) {
        fs.unlinkSync(sourcePath);
        removedOriginalCount += 1;
        console.log(`removed original: ${toPosix(path.relative(ROOT, sourcePath))}`);
      }
      continue;
    }

    if (needsLarge) {
      await convertPhotoVariant(sourcePath, largeTargetPath, 1920, 85);
    }

    if (needsThumb) {
      await convertPhotoVariant(sourcePath, thumbTargetPath, 640, 75);
    }

    if (canRemoveOriginal(sourcePath, largeTargetPath, thumbTargetPath)) {
      fs.unlinkSync(sourcePath);
      removedOriginalCount += 1;
    }

    processedCount += 1;
    console.log(`photography: ${toPosix(path.relative(ROOT, sourcePath))}`);
  }

  return { processedCount, removedOriginalCount };
}

async function main() {
  const markdownFiles = [
    ...collectFilesRecursive(BLOG_ROOT, (filePath) => filePath.endsWith(".md")),
    ...collectFilesRecursive(PROJECTS_ROOT, (filePath) => filePath.endsWith(".md")),
  ];
  let updatedCount = 0;
  let removedMarkdownOriginalCount = 0;

  for (const markdownPath of markdownFiles) {
    const { changed, removedOriginalCount } = await processMarkdownFile(markdownPath);
    removedMarkdownOriginalCount += removedOriginalCount;
    if (changed) {
      updatedCount += 1;
      console.log(`updated: ${toPosix(path.relative(ROOT, markdownPath))}`);
    }
  }

  const { processedCount: processedPhotographyCount, removedOriginalCount } =
    await processPhotographyImages();

  const totalRemovedOriginalCount = removedMarkdownOriginalCount + removedOriginalCount;

  console.log(
    `process-images done, updated markdown files: ${updatedCount}, processed photography images: ${processedPhotographyCount}, removed originals: ${totalRemovedOriginalCount}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
