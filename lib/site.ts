export const siteConfig = {
  name: "Mer-Ape",
  title: "Mer-Ape 个人网站",
  description: "记录产品、博客与摄影的个人网站。",
  author: "Mer-Ape",
  email: "yuweixin2020@email.szu.edu.cn",
};

function resolveSiteUrl() {
  const rawValue =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return rawValue.endsWith("/") ? rawValue.slice(0, -1) : rawValue;
}

export const siteUrl = resolveSiteUrl();

export function absoluteUrl(pathname = "/") {
  return pathname === "/" ? siteUrl : `${siteUrl}${pathname}`;
}
