import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import type { ProdutoMetricas } from "@/data/produtosData";

/**
 * Envelope retornado pelo endpoint /api/metricasporproduto.
 * dados.resultado é um único objeto cujas chaves são os IDs dos produtos
 * e os valores são ProdutoMetricas — equivalente ao antigo metricasPorProduto.
 */
interface MetricasPorProdutoResponse {
  sucesso: boolean;
  mensagem: string;
  procedure: string;
  dados: {
    resultado: Record<string, ProdutoMetricas>;
    registrosAfetados: number;
    tempoMs: number;
  };
}

/**
 * Busca as métricas por produto na API.
 * GET http://localhost:5006/api/metricasporproduto
 *
 * O retorno de dados.resultado já é um objeto indexado por produto_id (string).
 */
export async function fetchMetricasPorProduto(): Promise<Record<string, ProdutoMetricas>> {
  const response = await api.get<MetricasPorProdutoResponse>(
    "/api/metricasporproduto",
  );
  return response.dados.resultado;
}

/**
 * Hook React Query para consumir métricas por produto.
 * - staleTime 5 min  → evita re-fetch desnecessário
 * - refetchOnWindowFocus → mantém dados atualizados ao voltar à aba
 */
export function useMetricasPorProduto() {
  return useQuery<Record<string, ProdutoMetricas>>({
    queryKey: ["metricasPorProduto"],
    queryFn: fetchMetricasPorProduto,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

/**
 * Dado o mapa de métricas e um produtoId, retorna as métricas
 * do produto solicitado (ou undefined se não encontrado).
 * Opcionalmente recorta os arrays de evolução para o número de meses informado.
 */
export function getMetricasDoProduto(
  mapa: Record<string, ProdutoMetricas> | undefined,
  produtoId: string,
  months?: number,
): ProdutoMetricas | undefined {
  if (!mapa) return undefined;

  const base = mapa[produtoId];
  if (!base) return undefined;

  if (!months || months >= (base.evolucao_mensal?.length ?? 6)) return base;

  const sliceCount = Math.min(months, base.evolucao_mensal.length);
  return {
    ...base,
    evolucao_mensal: base.evolucao_mensal.slice(-sliceCount),
    tempo_resposta_mensal: base.tempo_resposta_mensal.slice(-sliceCount),
    comparativo: {
      ...base.comparativo,
      evolucao_nps: base.comparativo.evolucao_nps.slice(-sliceCount),
    },
  };
}

