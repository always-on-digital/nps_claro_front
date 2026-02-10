import { useQuery } from "@tanstack/react-query";
import { api, type ApiResponse } from "./api";
import type { Produto } from "@/data/produtosData";

/**
 * Busca a lista de produtos na API.
 * GET http://localhost:5006/api/produto
 *
 * Desempacota o envelope padrão (ApiResponse) e retorna dados.resultado
 * já tipado como Produto[].
 */
export async function fetchProdutos(): Promise<Produto[]> {
  const response = await api.get<ApiResponse<Produto>>("/api/produto");
  return response.dados.resultado;
}

/**
 * Hook React Query para consumir produtos.
 * - staleTime 5 min  → evita re-fetch desnecessário
 * - refetchOnWindowFocus → mantém dados atualizados ao voltar à aba
 */
export function useProdutos() {
  return useQuery<Produto[]>({
    queryKey: ["produtos"],
    queryFn: fetchProdutos,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

