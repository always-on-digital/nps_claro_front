import { useQuery } from "@tanstack/react-query";
import { api, type ApiResponse } from "./api";
import type { Cliente } from "@/data/mockData";

/**
 * Busca a lista de clientes na API.
 * GET http://localhost:5006/api/cliente
 *
 * Desempacota o envelope padrão (ApiResponse) e retorna dados.resultado
 * já tipado como Cliente[].
 */
export async function fetchClientes(): Promise<Cliente[]> {
  const response = await api.get<ApiResponse<Cliente>>("/api/cliente");
  return response.dados.resultado;
}

/**
 * Hook React Query para consumir clientes.
 * - staleTime 5 min  → evita re-fetch desnecessário
 * - refetchOnWindowFocus → mantém dados atualizados ao voltar à aba
 */
export function useClientes() {
  return useQuery<Cliente[]>({
    queryKey: ["clientes"],
    queryFn: fetchClientes,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

