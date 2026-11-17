# Nexora Digital

Loja de materiais digitais para concursos públicos em português brasileiro, com catálogo público e painel administrativo. A aplicação usa **Next.js 16**, **TypeScript**, **PostgreSQL** e **Prisma 7**. Cada produto tem uma página de apresentação, plano básico e combo opcional, com links de checkout configurados separadamente.

## Arquitetura

- `src/app`: páginas públicas, painel e rota de redirecionamento de compra.
- `src/components`: identidade visual e componentes reutilizáveis.
- `src/lib`: acesso ao banco, sessão administrativa, validação e formatação.
- `prisma/schema.prisma`: entidades e índices do banco.
- `prisma/migrations`: migrations SQL versionadas.
- `scripts/create-admin.ts`: criação inicial de administrador fora do navegador.

Os modelos incluem administradores e sessões, categorias, produtos e imagens, clientes, pedidos, pagamentos, eventos de integração, registros administrativos, configurações, FAQ, depoimentos e histórico de slugs. Pedidos e pagamentos **não são criados por cliques ou visitas ao checkout**.

## Requisitos

- Node.js 20.9 ou superior (Node.js 24 LTS recomendado)
- PostgreSQL acessível por `DATABASE_URL` (ou Docker para o banco local)
- Hospedagem com runtime Node.js e conexão TCP ao PostgreSQL

O projeto não foi adaptado para Cloudflare Workers. Prisma com o adaptador `pg` precisa de acesso ao PostgreSQL compatível com a hospedagem escolhida. Não implante como Worker sem revisar a estratégia de banco e o build.

## Banco Supabase

O Supabase pode fornecer o PostgreSQL sem alterar a autenticação atual do painel. Esta aplicação usa Prisma **somente no servidor**; não precisa de `NEXT_PUBLIC_SUPABASE_URL`, chave publicável nem `service_role` para acessar o banco.

1. Crie um projeto Supabase **separado** para a Nexora.
2. No painel do projeto, abra **Connect** e copie a string **Session pooler** (porta `5432`). Use-a em `DATABASE_URL` e `DIRECT_URL` no arquivo `.env` local. O modelo está em `.env.supabase.example`. A URL direta pode substituir `DIRECT_URL` se sua rede alcançar IPv6.
3. Use a senha de banco do projeto na string. Codifique caracteres especiais da senha na URL. Nunca coloque a conexão em variável `NEXT_PUBLIC_*` ou no Git.
4. Execute `npm run db:migrate` e depois `npm run admin:create`. O comando de migração usa `DIRECT_URL` quando ela estiver definida.
5. A migration inicial habilita RLS em todas as tabelas da aplicação no schema `public`, sem políticas para acesso anônimo. Mantenha a Data API do Supabase desativada se usar apenas Prisma.

Para aplicações Node persistentes, a conexão Session pooler funciona na maioria das redes IPv4. A escolha do pooler para uma hospedagem serverless depende do host e deve ser validada antes do deploy.

## Desenvolvimento local

1. Copie `.env.example` para `.env`. Troque a senha de exemplo nas variáveis `POSTGRES_PASSWORD` e `DATABASE_URL` pelo mesmo valor forte; se houver caracteres especiais, codifique-os na URL. Configure `NEXT_PUBLIC_SITE_URL`.
2. Se usar Docker, execute `docker compose up -d db`. O banco aceita conexões somente em `127.0.0.1:5432`. Você também pode usar uma instalação PostgreSQL existente.
3. Execute `npm install` e `npm run db:migrate` para aplicar as migrations.
4. Defina `ADMIN_EMAIL` e `ADMIN_PASSWORD` em um ambiente seguro. A senha deve ter pelo menos 12 caracteres. Execute `npm run admin:create` e remova essas duas variáveis do ambiente depois.
5. Execute `npm run dev` e abra `http://localhost:3000`.

O banco começa sem produtos, categorias ou depoimentos. Crie categorias em `/admin/categorias`, depois cadastre produtos em `/admin/produtos`. Um produto publicado só aparece no catálogo quando sua categoria está ativa. Sem URL de checkout válida, a compra fica indisponível.

O comando de administrador atualiza a senha caso o e-mail já exista. Em produção, execute-o apenas por canal administrativo seguro. Não coloque essas credenciais em variáveis `NEXT_PUBLIC_*`.

## Verificações

```bash
npm run typecheck
npm test
npm run build
npm audit
```

Sem uma instância PostgreSQL, os fluxos que escrevem e leem dados não podem ser testados de ponta a ponta. O build e os testes de validação não substituem esse teste. Antes do lançamento, teste login, CRUD, publicação, busca, redirecionamento de compra, bloqueio de acesso e sitemap em um ambiente de homologação conectado ao banco.

## Publicação

1. Provisione PostgreSQL com backup automático e plano de restauração.
2. Configure `DATABASE_URL` como segredo de servidor e `NEXT_PUBLIC_SITE_URL` com o domínio HTTPS final.
3. Aplique `npm run db:migrate` antes de iniciar a nova versão.
4. Execute `npm run build` e `npm run start` em um host Node.js. Garanta HTTPS, atualizações de segurança, logs e monitoramento.
5. Crie o administrador pelo comando seguro e configure contato, políticas e produtos no painel.
6. Verifique os links de checkout reais e as condições de entrega na Cakto.

`NEXT_PUBLIC_SITE_URL` alimenta canonicals, sitemap e dados estruturados. Use o domínio final em produção. O favicon e a logo usam os arquivos originais fornecidos.

## Integrações e limites atuais

- **Checkout:** use um link HTTPS `pay.cakto.com.br` para o plano básico e outro para o combo. Links Kiwify antigos continuam aceitos. O servidor valida novamente o destino ao redirecionar. UTMs de campanha são mantidas durante a navegação e repassadas ao checkout.
- **Oferta de combo:** cadastre nome, preço maior que o básico, itens adicionais e link próprio no editor do produto. Ao escolher o básico, o visitante recebe uma opção de upgrade e pode continuar com o básico ou selecionar o combo. Sem os dados do combo, a página mostra apenas o básico.
- **Pagamentos e entrega:** webhooks e entrega própria não estão ativos. A Cakto deverá executar a entrega configurada pelo lojista. O painel mostra vendas e faturamento como indisponíveis, sem estimativas.
- **Pedidos e clientes:** o banco está preparado; o preenchimento depende de webhook oficial autenticado, idempotente e testado. Não existe endpoint público de confirmação de pagamento.
- **Analytics:** IDs podem ser registrados no painel como preparação, mas nenhum rastreador é carregado até existir implementação de consentimento e eventos. Não registre compra confirmada antes da validação pelo provedor.
- **Imagens:** o painel recebe URLs HTTPS. Hospedagem privada de arquivos pagos e upload de imagens ainda requerem um serviço de armazenamento configurado.
- **Textos legais:** rascunhos sujeitos a revisão jurídica e aos dados reais da empresa. Não foram inventados CNPJ, endereço, avaliações nem números de compradores.

Para uma futura integração de webhook, obtenha documentação e credenciais oficiais da Cakto. Valide a assinatura/autenticidade antes de gravar eventos, use `IntegrationEvent(provider, providerEventId)` para idempotência, grave pedido e pagamento em uma transação e trate cancelamentos, contestações e reembolsos. Só então ative métricas e eventos de compra confirmada.

## Segurança e dados

Sessões administrativas usam token aleatório armazenado apenas como hash no banco e cookie `HttpOnly`, `SameSite=Lax` e `Secure` em produção. Senhas usam bcrypt. Toda ação administrativa revalida a sessão no servidor. O login limita tentativas por conta em uma janela de 15 minutos. As Server Actions do Next.js verificam `Origin` contra `Host` para proteção CSRF. URLs e dados de produtos são validados no servidor. Não são coletados cartões, CPF ou dados financeiros na loja.

Defina uma política de retenção e atendimento a titulares antes de receber dados de compradores por webhook. Faça backups do PostgreSQL e teste a restauração periodicamente.
