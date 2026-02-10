import { useQuery } from "@tanstack/react-query";
import { api, type ApiResponse } from "./api";
import type { MetricasGlobais } from "@/data/mockData";

/**
 * Busca as métricas globais na API.
 * GET http://localhost:5006/api/metricasglobais
 *
 * Desempacota o envelope padrão (ApiResponse) e retorna o primeiro
 * item de dados.resultado já tipado como MetricasGlobais.
 */
export async function fetchMetricasGlobais(): Promise<MetricasGlobais> {
  const response = await api.get<ApiResponse<MetricasGlobais>>("/api/metricasglobais");
  return response.dados.resultado[0];
}

/**
 * Hook React Query para consumir métricas globais.
 * - staleTime 5 min  → evita re-fetch desnecessário
 * - refetchOnWindowFocus → mantém dados atualizados ao voltar à aba
 */
export function useMetricasGlobais() {
  return useQuery<MetricasGlobais>({
    queryKey: ["metricasGlobais"],
    queryFn: fetchMetricasGlobais,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

