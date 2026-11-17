import { Product, Category } from "@/generated/prisma/client";
import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";

export function ProductCard({ product }: { product: Product & { category: Category } }) {
  return <article className="product-card">
    <Link href={`/produtos/${product.slug}`} className="product-image" aria-label={`Ver ${product.name}`}>
      {product.imageUrl ? <Image src={product.imageUrl} alt={`Capa de ${product.name}`} fill sizes="(max-width: 700px) 100vw, 33vw" unoptimized /> : <div className="cover-placeholder"><div className="cover-orbit"/><span>{product.productType}</span><strong>{product.name}</strong><small>NEXORA DIGITAL</small></div>}
      {product.featured && <span className="card-badge">Destaque</span>}
    </Link>
    <div className="product-card-body"><span className="eyebrow">{product.category.name}</span><h3><Link href={`/produtos/${product.slug}`}>{product.name}</Link></h3><p>{product.shortDescription}</p><div className="card-bottom"><div className="price-stack">{product.compareAtPriceCents && <s>{money(product.compareAtPriceCents)}</s>}<strong>{product.upgradePriceCents != null ? "A partir de " : ""}{money(product.priceCents)}</strong></div><Link className="arrow-link" href={`/produtos/${product.slug}`} aria-label={`Ver detalhes de ${product.name}`}>↗</Link></div><div className="card-actions"><Link href={`/produtos/${product.slug}`}>Ver detalhes e planos ↗</Link></div></div>
  </article>;
}
