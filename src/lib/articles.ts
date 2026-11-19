export type Article = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  date: string;
  productSlug: string;
  productLabel: string;
  sections: { heading: string; paragraphs: string[]; steps?: string[] }[];
  source: { label: string; url: string };
};

export const articles: Article[] = [
  {
    slug: "como-estudar-para-guarda-municipal",
    title: "Como estudar para Guarda Municipal: edital, base e revisão",
    description: "Um roteiro para estudar para Guarda Municipal sem confundir a preparação geral com as regras do edital da sua cidade.",
    summary: "Comece pelo edital do município, organize as matérias exigidas e reserve tempo para questões e revisão.",
    date: "2026-11-19",
    productSlug: "gcm-2026",
    productLabel: "Apostila GCM em PDF",
    sections: [
      { heading: "Qual é o primeiro passo?", paragraphs: ["Leia o edital da prefeitura e suas retificações. Anote cargo, etapas, disciplinas, pesos, critérios de eliminação e legislação municipal. Uma apostila geral ajuda a construir base, mas não substitui essas regras locais.", "Separe o conteúdo em três grupos: assuntos que você já domina, assuntos que precisa revisar e assuntos novos. Isso evita dedicar o mesmo tempo a tudo."], steps: ["Abra o edital oficial da cidade escolhida.", "Transforme o programa em uma lista de tópicos verificáveis.", "Marque as leis e normas locais que não aparecem em materiais gerais."] },
      { heading: "Como distribuir o estudo?", paragraphs: ["Alterne teoria curta com prática. Depois de estudar um tópico, resolva questões, corrija os erros e registre por que errou. Volte aos pontos fracos em ciclos de revisão.", "Português, matemática e noções de direito costumam exigir métodos diferentes: leitura e interpretação, resolução de problemas e consulta ao texto legal. Use o edital para decidir a prioridade de cada um."] },
      { heading: "Como usar uma apostila em PDF?", paragraphs: ["Confira o sumário e uma amostra antes da compra. Compare os módulos com o programa do seu município e use o PDF para organizar teoria, exercícios e simulados. Complete as lacunas com as fontes oficiais indicadas no edital.", "A Lei nº 13.022/2014 estabelece normas gerais para as guardas municipais. Para estudar sua aplicação, leia também a redação atual no portal oficial e observe o que o seu edital efetivamente cobra."] }
    ],
    source: { label: "Lei nº 13.022/2014 — Planalto", url: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l13022.htm" }
  },
  {
    slug: "como-se-preparar-para-escrevente-tjsp",
    title: "Como se preparar para Escrevente TJSP com um plano de estudo",
    description: "Veja como transformar o edital de Escrevente TJSP em um plano de leitura, redação, questões e revisão.",
    summary: "Use o edital do TJSP como referência, pratique o formato das provas e revise os pontos em que mais erra.",
    date: "2026-11-19",
    productSlug: "tjsp-escrevente",
    productLabel: "Apostila TJSP Escrevente em PDF",
    sections: [
      { heading: "Comece pelo edital correto", paragraphs: ["O TJSP pode publicar editais distintos por região e momento. Confirme o número do edital, a região da vaga, o conteúdo programático e todas as retificações antes de montar o plano. Não trate uma notícia sobre outro certame como regra para a sua prova.", "Crie uma tabela simples com disciplina, tópicos, peso ou número de questões quando informado, situação atual e próxima revisão."] },
      { heading: "Combine leitura, escrita e questões", paragraphs: ["Reserve blocos de estudo para a teoria e blocos menores para testar o que reteve. Nas matérias jurídicas, confira o texto normativo vigente indicado no edital. Em Português e Informática, pratique os tipos de questão previstos.", "Quando o edital incluir redação, escreva textos completos dentro do tempo disponível e revise estrutura, clareza e correção. Uma oficina de redação no material de apoio serve para treinar; os critérios oficiais são sempre os do edital."], steps: ["Estude um tópico delimitado.", "Resolva questões sem consultar o resumo.", "Registre erros e refaça os itens depois da revisão."] },
      { heading: "O que conferir antes de comprar uma apostila?", paragraphs: ["Veja a edição, o sumário, as amostras, o formato do arquivo e as condições de entrega. Compare o conteúdo da apostila ao edital que você escolheu. Questões autorais são treino; elas não devem ser confundidas com questões oficiais da banca."] }
    ],
    source: { label: "Concursos para Escrevente — TJSP", url: "https://portal.tjsp.jus.br/Noticias/Noticia?codigoNoticia=115772" }
  },
  {
    slug: "como-estudar-para-concurso-banestes",
    title: "Como estudar para o BANESTES: edital e rotina de questões",
    description: "Organize sua preparação para Técnico Bancário do BANESTES a partir dos editais oficiais e de um ciclo de prática.",
    summary: "Confira o edital oficial, mapeie as disciplinas e acompanhe erros em questões e simulados.",
    date: "2026-11-19",
    productSlug: "banestes-tecnico-bancario",
    productLabel: "Apostila BANESTES em PDF",
    sections: [
      { heading: "Encontre a versão atual do edital", paragraphs: ["A página oficial do BANESTES reúne o edital de abertura e as retificações do concurso. Consulte a versão aplicável ao cargo de Técnico Bancário antes de confiar em resumos ou listas de matérias. Regras, etapas e conteúdo podem mudar por retificação.", "Transforme o programa em uma lista de tarefas e destaque assuntos já conhecidos, assuntos novos e pontos que exigem consulta à fonte oficial."] },
      { heading: "Monte um ciclo de estudo que você consegue cumprir", paragraphs: ["Distribua leitura, exercícios e revisão pela semana. Depois de cada bloco, resolva algumas questões e anote o motivo de cada erro. Essa lista orienta a revisão seguinte com mais precisão do que apenas reler páginas.", "Ao usar simulados, reproduza o tempo e as condições da prova descritas no edital. Corrija tanto as respostas erradas quanto os acertos por sorte."], steps: ["Compare o sumário do material ao programa oficial.", "Estude um assunto e pratique sem consultar o gabarito.", "Revise os erros antes do próximo simulado."] },
      { heading: "Como avaliar uma apostila digital?", paragraphs: ["Confira a edição, as disciplinas incluídas, as páginas de amostra, o preço e a entrega no checkout. A apostila pode organizar o estudo e fornecer questões autorais, mas não substitui o edital nem garante aprovação."] }
    ],
    source: { label: "Editais e retificações do concurso — BANESTES", url: "https://banestes.com.br/publicacoes_legais/concurso2026.htm" }
  }
];
