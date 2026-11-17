import { db } from "@/lib/db";
import { isCaktoCheckoutUrl } from "@/lib/checkout";

export async function getCuratedCheckout(slug: string) {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: `checkout:${slug}` } });
    return setting && isCaktoCheckoutUrl(setting.value) ? setting.value : null;
  } catch {
    return null;
  }
}
