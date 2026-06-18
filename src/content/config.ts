import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    updated: z.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    project: z.string().optional(),
    type: z.enum(["article", "index", "note"]).default("article"),
    featured: z.boolean().default(false),
    order: z.number().optional(),
    plain: z.boolean().default(false),
    seriesNavigation: z
      .object({
        indexHref: z.string(),
        indexLabel: z.string().optional(),
        previousHref: z.string().optional(),
        previousLabel: z.string().optional(),
        nextHref: z.string().optional(),
        nextLabel: z.string().optional(),
      })
      .optional(),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(["active", "draft", "complete"]).default("active"),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    startHere: z.string(),
    path: z.string().optional(),
  }),
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { blog, projects, pages };
