export const curatedProducts = [
  {
    slug: "pmsp-2026",
    name: "Apostila PM-SP 2026 | Soldado PM",
    productType: "Apostila digital",
    eyebrow: "PÁGINA EXCLUSIVA · SOLDADO PM-SP 2026",
    shortDescription: "Um plano completo de estudo com aulas, questões, simulados e revisão para a preparação de Soldado PM-SP.",
    searchTerms: "pmsp pm-sp polícia militar são paulo soldado",
    highlights: ["47 aulas", "414 itens", "3 simulados"],
    imageUrl: "/pmsp-2026/capa.webp",
    priceCents: 2990,
    compareAtPriceCents: 5990,
    featured: true
  }
] as const;

export function isLegacyPmspProduct(product: { name: string; slug: string }) {
  return /apostila/i.test(product.name) && /pmsp|pm-sp/i.test(product.name) && /2026/.test(product.name) && /soldado/i.test(product.name);
}
