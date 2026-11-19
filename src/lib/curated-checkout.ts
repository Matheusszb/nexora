import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { isCaktoCheckoutUrl } from "@/lib/checkout";

const getCheckoutSetting = unstable_cache(
  (slug: string) => db.siteSetting.findUnique({ where: { key: `checkout:${slug}` } }),
  ["curated-checkout"],
  { tags: ["curated-checkout"], revalidate: 300 }
);

export async function getCuratedCheckout(slug: string) {
  try {
    const setting = await getCheckoutSetting(slug);
    return setting && isCaktoCheckoutUrl(setting.value) ? setting.value : null;
  } catch {
    return null;
  }
}
