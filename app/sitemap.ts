import type { MetadataRoute } from "next";
import { getAllLessons } from "@/lib/lessons";
import { PROBLEMS } from "@/lib/problems";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const routes = ["/", "/learn", "/practice", "/about"];
  const lessonRoutes = getAllLessons().map((lesson) => `/learn/${lesson.slug}`);
  const problemRoutes = PROBLEMS.map((problem) => `/practice/${problem.slug}`);

  return [...routes, ...lessonRoutes, ...problemRoutes].map((route) => ({
    url: new URL(route, siteUrl).toString(),
  }));
}
