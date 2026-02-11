import { Localizacao } from '../data/localizacao';
import { citiesData, CityCoords } from '../data/citiesData';
import { api, type ApiResponse } from './api';
import { useQuery } from "@tanstack/react-query";

// Busca dados de localização via API (fc_agrupa_localizacao)
export async function fetchLocalizacoes(): Promise<(Localizacao & CityCoords)[]> {
  const response = await api.get<ApiResponse<any>>('/api/localizacao');
  return response.dados.resultado.map(loc => {
    // Mapeia campos do backend (português) para inglês
    const region = loc.regiao;
    const state = loc.estado;
    const city = loc.cidade;
    const quantidade = loc.quantidade;
    if (!city || !state) {
      return {
        region,
        state,
        city,
        quantidade,
        latitude: null,
        longitude: null,
      };
    }
    const coords = citiesData.find(
      c => c.city.toLowerCase() === city.toLowerCase() && c.state === state
    );

    console.log(">>> Localização:", { region, state, city, quantidade, coords });
    return {
      region,
      state,
      city,
      quantidade,
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
    };
  });
}

/**
 * Hook React Query para consumir localizações (capitais/estados).
 * - staleTime 5 min  → evita re-fetch desnecessário
 * - refetchOnWindowFocus → mantém dados atualizados ao voltar à aba
 */
export function useLocalizacoes() {
  return useQuery<(Localizacao & CityCoords)[]>({
    queryKey: ["localizacoes"],
    queryFn: fetchLocalizacoes,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
