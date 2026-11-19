import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

// Keep database reads shared across visitors while admin actions invalidate the tags.
export const getHomeData = unstable_cache(
  () => Promise.all([
    db.product.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ featured: "desc" }, { publishedAt: "desc" }] }),
    db.faq.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    db.testimonial.findMany({ where: { active: true, authorized: true }, orderBy: { sortOrder: "asc" }, take: 3 }),
    db.siteSetting.findMany({ where: { key: { in: ["heroTitle", "heroSubtitle"] } } })
  ]),
  ["home-data"],
  { tags: ["home-data"], revalidate: 300 }
);

export const getDefaultCatalog = unstable_cache(
  () => db.product.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ publishedAt: "desc" }] }),
  ["default-catalog"],
  { tags: ["catalog-products"], revalidate: 300 }
);
