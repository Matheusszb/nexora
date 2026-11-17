import type { Category } from "@/generated/prisma/client";
import Image from "next/image";
import Link from "next/link";

type VisibleCategory = Category & { _count: { products: number } };

const plannedCategories = [
  "Polícia Militar",
  "Polícia Civil",
  "Guarda Municipal",
  "Concursos bancários",
  "Tribunais",
  "Área administrativa",
  "Educação",
  "Saúde"
];

const symbols = ["◇", "⌘", "▤", "▦", "✧", "↗", "◈", "✦"];

export function CategoryShowcase({ categories, unavailable }: { categories: VisibleCategory[]; unavailable: boolean }) {
  return <section className="section" id="categorias"><div className="container">
    <div className="section-head"><div><span className="eyebrow">ENCONTRE SUA ÁREA</span><h2>Prepare-se por carreira</h2></div><p>Explore os materiais pela área do concurso que você pretende prestar.</p></div>
    {unavailable && <p className="category-status" role="status">O catálogo está temporariamente indisponível. As áreas abaixo mostram temas planejados.</p>}
    <div className="category-grid">
      {categories.length > 0 ? categories.map((category, i) => <Link className="category-card" href={`/categorias/${category.slug}`} key={category.id}>
        {category.imageUrl && <Image className="category-card-image" src={category.imageUrl} alt="" fill sizes="(max-width: 760px) 50vw, 25vw" unoptimized />}
        <span className="category-icon" aria-hidden="true">{symbols[i % symbols.length]}</span>
        <div className="category-card-copy"><h3>{category.name}</h3><small>{category._count.products} {category._count.products === 1 ? "produto" : "produtos"} disponíveis <span aria-hidden="true">↗</span></small></div>
      </Link>) : plannedCategories.map((name, i) => <div className="category-card category-card-preview" key={name}>
        <span className="category-icon" aria-hidden="true">{symbols[i % symbols.length]}</span>
        <div className="category-card-copy"><h3>{name}</h3><small>Em preparação</small></div>
      </div>)}
    </div>
  </div></section>;
}
