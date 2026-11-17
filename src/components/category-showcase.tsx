import type { Category } from "@/generated/prisma/client";
import Image from "next/image";
import Link from "next/link";

type VisibleCategory = Category & { _count: { products: number } };

const plannedCategories = [
  "Concursos públicos",
  "Cursos online",
  "E-books",
  "Planilhas e ferramentas",
  "Marketing digital",
  "Produtividade",
  "Materiais educativos"
];

const symbols = ["◇", "⌘", "▤", "▦", "✧", "↗", "◈", "✦"];

export function CategoryShowcase({ categories, unavailable }: { categories: VisibleCategory[]; unavailable: boolean }) {
  return <section className="section" id="categorias"><div className="container">
    <div className="section-head"><div><span className="eyebrow">Encontre seu caminho</span><h2>Explore por categoria</h2></div><p>Escolha o assunto que faz sentido para o seu momento e veja os materiais disponíveis.</p></div>
    {unavailable && <p className="category-status" role="status">O catálogo está temporariamente indisponível. As categorias abaixo são uma prévia dos temas planejados.</p>}
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
