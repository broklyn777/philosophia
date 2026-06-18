import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://philosophia.example.com",
  integrations: [mdx()],
  markdown: {
    remarkRehype: {
      footnoteLabel: "Fotnoter",
      footnoteBackLabel: "Tillbaka till texten",
    },
  },
});
