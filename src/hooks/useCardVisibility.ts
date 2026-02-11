import { useState, useCallback } from "react";

const STORAGE_KEY = "dashboard-card-visibility";

/**
 * Hook para gerenciar a visibilidade dos cards do dashboard.
 *
 * - Persiste o estado no localStorage.
 * - Cards novos que não existem no storage assumem o valor do `defaults`.
 * - IDs em `alwaysVisible` são forçados a `true` e não podem ser desativados.
 *
 * @param defaults  – Record com todos os IDs e seus valores padrão (true/false).
 * @param alwaysVisible – conjunto de IDs que nunca podem ser ocultados (ex: "map", "clientes").
 */
export function useCardVisibility(
  defaults: Record<string, boolean>,
  alwaysVisible: Set<string> = new Set(),
) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Record<string, boolean> = JSON.parse(stored);
        // Merge: para cada chave do defaults, usa o valor salvo se existir,
        // senão usa o default. Garante que novos cards adicionados no futuro
        // entrem automaticamente com o valor padrão.
        const merged: Record<string, boolean> = {};
        for (const key of Object.keys(defaults)) {
          if (alwaysVisible.has(key)) {
            merged[key] = true;
          } else {
            merged[key] = key in parsed ? parsed[key] : defaults[key];
          }
        }
        return merged;
      }
    } catch {
      // ignore – usa defaults
    }
    return { ...defaults };
  });

  /** Alterna a visibilidade de um card específico. */
  const toggleCard = useCallback(
    (id: string) => {
      if (alwaysVisible.has(id)) return; // não permite desativar cards estruturais
      setVisibility((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [alwaysVisible],
  );

  /** Define a visibilidade de um card para um valor específico. */
  const setCardVisible = useCallback(
    (id: string, visible: boolean) => {
      if (alwaysVisible.has(id)) return;
      setVisibility((prev) => {
        const next = { ...prev, [id]: visible };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [alwaysVisible],
  );

  /** Reseta tudo para os valores padrão. */
  const resetVisibility = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setVisibility({ ...defaults });
  }, [defaults]);

  /** Retorna true se o card com o ID informado está visível. */
  const isVisible = useCallback(
    (id: string): boolean => {
      if (alwaysVisible.has(id)) return true;
      return visibility[id] ?? true;
    },
    [visibility, alwaysVisible],
  );

  return {
    visibility,
    toggleCard,
    setCardVisible,
    resetVisibility,
    isVisible,
  } as const;
}

