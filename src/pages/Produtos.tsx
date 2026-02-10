import { useState } from "react";
import { Loader2 } from "lucide-react";
import { getMetricasProduto } from "@/data/produtosData";
import { useProdutos } from "@/services/produtosService";
import { ProdutoList } from "@/components/produtos/ProdutoList";
import { ProdutoDashboard } from "@/components/produtos/ProdutoDashboard";

export default function Produtos() {
  const { data: produtos = [], isLoading, isError } = useProdutos();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const activeId = selectedId ?? produtos[0]?.id ?? 0;
  const metricas = getMetricasProduto(activeId);
  const produtoNome = produtos.find((p) => p.id === activeId)?.nome ?? "";

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando produtos…</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex flex-1 items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-medium text-destructive">Erro ao carregar produtos</p>
          <p className="text-xs text-muted-foreground">Verifique se a API está disponível em localhost:5006</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-5 overflow-auto">
      <div className="mb-3">
        <h1 className="text-base font-bold text-foreground">Produtos</h1>
        <p className="text-[11px] text-muted-foreground">
          Selecione um produto para visualizar seus indicadores de NPS e satisfação
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <aside className="w-full lg:w-[10%] lg:min-w-[140px] shrink-0">
          <ProdutoList
            produtos={produtos}
            selectedId={activeId}
            onSelect={setSelectedId}
          />
        </aside>

        <section className="w-full lg:w-3/4 min-w-0">
          <ProdutoDashboard metricas={metricas} produtoNome={produtoNome} />
        </section>
      </div>
    </main>
  );
}
