import { useState, useMemo, type ReactNode } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import MetricsCards from "@/components/dashboard/MetricsCards";
import MapaBrasil from "@/components/dashboard/MapaBrasil";
import ComparativoChart from "@/components/dashboard/ComparativoChart";
import EvolucaoChart from "@/components/dashboard/EvolucaoChart";
import TabelaClientes from "@/components/dashboard/TabelaClientes";
import PerfilModal from "@/components/dashboard/PerfilModal";
import ChatButton from "@/components/dashboard/ChatButton";
import { SortableContainer } from "@/components/dashboard/SortableContainer";
import { SortableSection } from "@/components/dashboard/SortableSection";
import { useSortableSections } from "@/hooks/useSortableSections";
import {
  regioes,
  evolucaoData,
  type Cliente,
} from "@/data/mockData";
import { useClientes } from "@/services/clientesService";
import { useMetricasGlobais } from "@/services/metricasGlobaisService";

const SECTION_IDS = ["metrics", "map", "charts", "table"];

const defaultMetricas = {
  total_clientes: 0,
  total_respondidos: 0,
  total_calculados: 0,
  nps_score: 0,
  promotores: { quantidade: 0, percentual: 0 },
  neutros: { quantidade: 0, percentual: 0 },
  detratores: { quantidade: 0, percentual: 0 },
};

const Index = () => {
  const { data: clientes = [], isLoading: isLoadingClientes, isError: isErrorClientes } = useClientes();
  const { data: metricasGlobais, isLoading: isLoadingMetricas, isError: isErrorMetricas } = useMetricasGlobais();

  const isLoading = isLoadingClientes || isLoadingMetricas;
  const isError = isErrorClientes || isErrorMetricas;
  const metricas = metricasGlobais ?? defaultMetricas;

  const [selectedCidade, setSelectedCidade] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [perfilCliente, setPerfilCliente] = useState<Cliente | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const { sectionOrder, handleDragEnd } = useSortableSections(SECTION_IDS);

  const handleSelectCidade = (cidade: string | null, estado: string | null) => {
    setSelectedCidade(cidade);
    setSelectedEstado(estado);
  };

  const filteredClientes = useMemo(() => {
    if (!selectedCidade) return clientes;
    return clientes.filter((c) => c.regiao.includes(selectedCidade));
  }, [selectedCidade, clientes]);

  const sectionsMap: Record<string, ReactNode> = {
    metrics: <MetricsCards metricas={metricas} />,
    map: (
      <MapaBrasil
        regioes={regioes}
        selectedCidade={selectedCidade}
        onSelectCidade={handleSelectCidade}
      />
    ),
    charts: (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ComparativoChart metricas={metricas} />
        <EvolucaoChart data={evolucaoData} />
      </div>
    ),
    table: (
      <TabelaClientes
        clientes={filteredClientes}
        onViewPerfil={setPerfilCliente}
      />
    ),
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando dados…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-medium text-destructive">Erro ao carregar dados</p>
          <p className="text-xs text-muted-foreground">Verifique se a API está disponível na porta 5006 do servidor atual</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1440px] space-y-4 px-4 py-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <button
            onClick={() => handleSelectCidade(null, null)}
            className={`transition-colors hover:text-foreground ${!selectedCidade ? "font-semibold text-foreground" : ""}`}
          >
            Brasil
          </button>
          {selectedEstado && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-foreground">
                {selectedEstado}
              </span>
            </>
          )}
          {selectedCidade && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-primary">
                {selectedCidade}
              </span>
            </>
          )}
        </nav>

        {/* Sortable Sections */}
        <SortableContainer items={sectionOrder} onDragEnd={handleDragEnd}>
          <div className="space-y-4">
            {sectionOrder.map((id) => (
              <SortableSection key={id} id={id}>
                {sectionsMap[id]}
              </SortableSection>
            ))}
          </div>
        </SortableContainer>
      </main>

      {/* Profile Modal */}
      <PerfilModal
        cliente={perfilCliente}
        open={!!perfilCliente}
        onClose={() => setPerfilCliente(null)}
      />

      {/* Chat */}
      <ChatButton open={chatOpen} onToggle={() => setChatOpen((o) => !o)} />
    </div>
  );
};

export default Index;
