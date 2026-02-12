/**
 * Monta a URL base da API dinamicamente a partir da URL do navegador.
 * Mantém protocolo e hostname atuais, trocando apenas a porta para 5006.
 *
 * Exemplos:
 *   http://localhost:8080        → http://localhost:5006
 *   https://192.168.0.10:8080   → https://192.168.0.10:5006
 *   https://meudominio.com:8080 → https://meudominio.com:5006
 */
function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:5006";
  }
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:5006`;
}

const API_BASE_URL = getApiBaseUrl();

/**
 * Envelope padrão retornado por todas as procedures da API.
 * Reutilize este tipo em qualquer service futuro.
 */
export interface ApiResponse<T> {
  sucesso: boolean;
  mensagem: string;
  procedure: string;
  dados: {
    resultado: T[];
    registrosAfetados: number;
    tempoMs: number;
  };
}

/**
 * Cliente HTTP genérico para a API.
 * CORS liberado no servidor — nenhuma restrição no lado do client.
 */
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};

