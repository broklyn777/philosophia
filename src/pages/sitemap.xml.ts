import type { APIRoute } from "astro";
import { getTagCounts, getProjects, getPublishedPosts, postUrl, projectUrl } from "../lib/content";

const staticPaths = [
  "/",
  "/blog/",
  "/projekt/",
  "/amnen/",
  "/sok/",
  "/om/",
  "/om-manniskan/",
  "/fragor-som-vagrar-forsvinna/",
  "/resentment/",
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toIsoDate = (date: Date) => date.toISOString().split("T")[0];

interface SitemapUrl {
  path: string;
  lastmod?: string;
}

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error("Missing Astro site config for sitemap generation.");
  }

  const [posts, projects, tags] = await Promise.all([
    getPublishedPosts(),
    getProjects(),
    getTagCounts(),
  ]);

  const urls: SitemapUrl[] = [
    ...staticPaths.map((path) => ({ path })),
    ...projects.map((project) => ({ path: projectUrl(project) })),
    ...tags.map((tag) => ({ path: `/amnen/${tag.slug}/` })),
    ...posts.map((post) => ({
      path: postUrl(post.slug),
      lastmod: toIsoDate(post.data.updated ?? post.data.date),
    })),
  ];

  const uniqueUrls = [...new Map(urls.map((url) => [url.path, url])).values()];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls
  .map((url) => {
    const loc = new URL(url.path, site).toString();
    const lastmod = url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : "";
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod}\n  </url>`;
  })
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
