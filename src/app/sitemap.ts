import { MetadataRoute } from "next";
import { getProperties } from "@/lib/tokkobroker";

// ─── ISR: Regenerate the sitemap every 12 hours automatically ──────────────
// This means: when a new property is added or removed in Tokko Broker,
// the sitemap will reflect it within 12 hours — no manual deploy needed.
export const revalidate = 43200; // 43200 seconds = 12 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.freirepropiedades.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tasar-propiedad`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guia-vendedores`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic property pages
  try {
    const properties = await getProperties(500);
    const propertyPages: MetadataRoute.Sitemap = properties.map((prop: any) => ({
      url: `${baseUrl}/p/${prop.id}-prop`,
      lastModified: new Date(prop.updated_at || prop.created_at || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...staticPages, ...propertyPages];
  } catch {
    return staticPages;
  }
}
