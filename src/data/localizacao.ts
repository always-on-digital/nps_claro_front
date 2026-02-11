// Interfaces para dados de localização
export interface Localizacao {
  region: string;
  state: string;
  city: string;
  quantidade: number;
}

export interface CapitalCoords {
  city: string;
  state: string;
  region: string;
  latitude: number;
  longitude: number;
}
