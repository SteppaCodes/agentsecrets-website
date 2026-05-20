import { MetadataRoute } from "next";
import { DOCS_SECTIONS } from "@/lib/docs-sections";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://agentsecrets.theseventeen.co";

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  const docsRoutes = DOCS_SECTIONS.map((section) => ({
    url: `${baseUrl}/docs/${section.id === "what-is-agentsecrets" ? "" : section.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...docsRoutes];
}
