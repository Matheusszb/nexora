import Link from "next/link";
import { Logo } from "./logo";
import { logout } from "@/app/admin/actions";

const nav = [
  ["/admin", "◫", "Visão geral"], ["/admin/produtos", "▦", "Produtos"], ["/admin/conteudo", "✎", "Conteúdo"], ["/admin/pedidos", "▤", "Pedidos"], ["/admin/clientes", "♙", "Clientes"], ["/admin/configuracoes", "⚙", "Configurações"]
];

export function AdminShell({ children, title, subtitle, email }: { children: React.ReactNode; title: string; subtitle?: string; email: string }) {
  return <div className="admin-app"><aside className="admin-sidebar"><Logo /><div className="admin-sidebar-label">PAINEL ADMINISTRATIVO</div><nav>{nav.map(([href,icon,label]) => <Link key={href} href={href}><span aria-hidden="true">{icon}</span>{label}</Link>)}</nav><div className="admin-sidebar-bottom"><Link href="/" target="_blank">↗ &nbsp; Ver loja</Link><form action={logout}><button type="submit">Sair da conta</button></form></div></aside><div className="admin-content"><header className="admin-topbar"><div><span className="eyebrow">NEXORA DIGITAL / ADMIN</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div><div className="admin-user"><span>Administrador</span><small>{email}</small></div></header><div className="admin-mobile-nav">{nav.map(([href,,label]) => <Link key={href} href={href}>{label}</Link>)}</div><div className="admin-main">{children}</div></div></div>;
}
