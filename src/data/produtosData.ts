export interface Produto {
  id: string;
  nome: string;
  categoria: string;
}

export interface NpsDistribuicao {
  percentual: number;
  quantidade: number;
}

export interface ComparativoNps {
  nps_respondido: {
    score: number;
    total_clientes: number;
    promotores: NpsDistribuicao;
    neutros: NpsDistribuicao;
    detratores: NpsDistribuicao;
  };
  nps_calculado: {
    score: number;
    total_clientes: number;
    promotores: NpsDistribuicao;
    neutros: NpsDistribuicao;
    detratores: NpsDistribuicao;
  };
  evolucao_nps: { mes: string; respondido: number; calculado: number }[];
}

export interface ProdutoMetricas {
  nps_score: number;
  csat_score: number;
  csat_mes_anterior: number;
  ces_score: number;
  tempo_medio_resposta: string;
  tempo_mes_anterior: string;
  total_clientes: number;
  promotores: { percentual: number; quantidade: number };
  neutros: { percentual: number; quantidade: number };
  detratores: { percentual: number; quantidade: number };
  evolucao_mensal: { mes: string; csat: number; nps: number }[];
  tempo_resposta_mensal: { mes: string; tempo: number }[];
  satisfacao_breakdown: {
    categoria: string;
    muitoSatisfeito: number;
    satisfeito: number;
    neutro: number;
    insatisfeito: number;
    muitoInsatisfeito: number;
  }[];
  comparativo: ComparativoNps;
}

// Dados mock removidos — métricas por produto agora vêm da API via useMetricasPorProduto()
// Veja: src/services/metricasPorProdutoService.ts
