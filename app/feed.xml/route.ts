import { getAllPosts } from "@/lib/markdown";
import { absoluteUrl, siteConfig } from "@/lib/site";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = await getAllPosts();

  const items = posts
    .map(
      (post) => `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${absoluteUrl(`/blog/${post.slug}`)}</link>
          <guid>${absoluteUrl(`/blog/${post.slug}`)}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <description>${escapeXml(post.excerpt)}</description>
        </item>`,
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(siteConfig.title)}</title>
        <link>${absoluteUrl()}</link>
        <description>${escapeXml(siteConfig.description)}</description>
        ${items}
      </channel>
    </rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
