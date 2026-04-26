import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/markdown";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type OpenGraphImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #0f4f3c 0%, #f8faf6 100%)",
          color: "#191c1b",
          padding: "64px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#0f4f3c",
          }}
        >
          Mer Ape Blog
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 30, color: "#58645d" }}>{post?.category ?? "Blog"}</div>
          <div style={{ fontSize: 64, lineHeight: 1.15, fontWeight: 700 }}>
            {post?.title ?? "Blog Post"}
          </div>
          <div style={{ fontSize: 28, color: "#58645d" }}>{post?.excerpt ?? ""}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#58645d" }}>
          <div>{post?.date ?? ""}</div>
          <div>{post?.readingTime ?? ""}</div>
        </div>
      </div>
    ),
    size,
  );
}
