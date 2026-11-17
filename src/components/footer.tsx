import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return <footer className="footer"><div className="container footer-grid">
    <div><Logo /><p>Materiais digitais para quem se prepara para concursos públicos.</p></div>
    <div><h3>Explore</h3><Link href="/produtos">Materiais</Link><Link href="/#categorias">Áreas de concurso</Link><Link href="/sobre">Sobre a Nexora</Link></div>
    <div><h3>Ajuda</h3><Link href="/contato">Contato</Link><Link href="/#faq">Perguntas frequentes</Link></div>
    <div><h3>Informações</h3><Link href="/legal/privacidade">Privacidade</Link><Link href="/legal/termos">Termos de uso</Link><Link href="/legal/reembolso">Reembolso</Link><Link href="/legal/cookies">Cookies</Link></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Nexora Digital</span><span>Preparação para concursos com escolhas mais claras.</span></div></footer>;
}
