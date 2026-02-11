// Lista de capitais brasileiras com latitude e longitude
export interface CityCoords {
  city: string;
  state: string;
  region: string;
  latitude: number;
  longitude: number;
}

export const citiesData: CityCoords[] = [
  { city: "Brasília", state: "DF", region: "Centro-Oeste", latitude: -15.793889, longitude: -47.882778 },
  { city: "Goiânia", state: "GO", region: "Centro-Oeste", latitude: -16.686389, longitude: -49.264167 },
  { city: "Cuiabá", state: "MT", region: "Centro-Oeste", latitude: -15.601410, longitude: -56.097891 },
  { city: "Salvador", state: "BA", region: "Nordeste", latitude: -12.971389, longitude: -38.501389 },
  { city: "Fortaleza", state: "CE", region: "Nordeste", latitude: -3.71722, longitude: -38.54306 },
  { city: "São Luís", state: "MA", region: "Nordeste", latitude: -2.52972, longitude: -44.30278 },
  { city: "João Pessoa", state: "PB", region: "Nordeste", latitude: -7.115, longitude: -34.863 },
  { city: "Recife", state: "PE", region: "Nordeste", latitude: -8.04756, longitude: -34.877 },
  { city: "Rio Branco", state: "AC", region: "Norte", latitude: -9.97499, longitude: -67.8243 },
  { city: "Belém", state: "PA", region: "Norte", latitude: -1.45502, longitude: -48.5024 },
  { city: "Palmas", state: "TO", region: "Norte", latitude: -10.2128, longitude: -48.3603 },
  { city: "Porto Velho", state: "RO", region: "Norte", latitude: -8.76116, longitude: -63.9039 },
  { city: "Vitória", state: "ES", region: "Sudeste", latitude: -20.3155, longitude: -40.3128 },
  { city: "Belo Horizonte", state: "MG", region: "Sudeste", latitude: -19.8157, longitude: -43.9542 },
  { city: "Rio de Janeiro", state: "RJ", region: "Sudeste", latitude: -22.9068, longitude: -43.1729 },
  { city: "São Paulo", state: "SP", region: "Sudeste", latitude: -23.5505, longitude: -46.6333 },
  { city: "Curitiba", state: "PR", region: "Sul", latitude: -25.4284, longitude: -49.2733 },
  { city: "Porto Alegre", state: "RS", region: "Sul", latitude: -30.0346, longitude: -51.2177 },
  { city: "Florianópolis", state: "SC", region: "Sul", latitude: -27.5949, longitude: -48.5481 }
];
