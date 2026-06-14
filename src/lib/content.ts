import { getCollection } from "astro:content";

export async function getPublishedPosts() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getProjects() {
  const projects = await getCollection("projects");
  return projects.sort((a, b) => a.data.title.localeCompare(b.data.title, "sv"));
}

export function postUrl(slug: string) {
  return `/blog/${slug}/`;
}

export function projectUrl(project: { slug: string; data: { path?: string } }) {
  return project.data.path ?? `/projekt/${project.slug}/`;
}

export function slugifyTag(tag: string) {
  return tag
    .toLocaleLowerCase("sv")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getTagCounts() {
  const posts = await getPublishedPosts();
  const counts = new Map<string, { tag: string; slug: string; count: number }>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = slugifyTag(tag);
      const current = counts.get(slug);
      counts.set(slug, {
        tag: current?.tag ?? tag,
        slug,
        count: (current?.count ?? 0) + 1,
      });
    }
  }

  return [...counts.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "sv"));
}
