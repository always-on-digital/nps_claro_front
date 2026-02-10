import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Smartphone, Tv, Wifi, Phone, Calendar, MapPin, Mail, MessageSquare,
  TrendingUp, TrendingDown, Package, Clock, Activity, BarChart3, Users,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import type { Cliente } from "@/data/mockData";
import { maskCpf } from "@/data/mockData";

interface PerfilModalProps {
  cliente: Cliente | null;
  open: boolean;
  onClose: () => void;
}

const productIcons: Record<string, typeof Smartphone> = {
  "Claro Móvel": Smartphone,
  "Claro TV": Tv,
  "Internet": Wifi,
  "Claro Fixo": Phone,
};

function getProductIcon(product: string) {
  for (const [key, Icon] of Object.entries(productIcons)) {
    if (product.toLowerCase().includes(key.toLowerCase())) return Icon;
  }
  return Smartphone;
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

function getEngagementLevel(nps: number) {
  if (nps >= 9) return { label: "HIGH ENGAGEMENT", className: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  if (nps >= 7) return { label: "MEDIUM ENGAGEMENT", className: "bg-amber-100 text-amber-700 border-amber-200" };
  return { label: "LOW ENGAGEMENT", className: "bg-red-100 text-red-700 border-red-200" };
}

function generateMockEmail(name: string) {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ".") + "@email.com";
}

function generateNpsHistory(currentScore: number) {
  const data = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const variation = Math.round((Math.random() - 0.5) * 3);
    const score = Math.max(0, Math.min(10, currentScore + variation - (5 - i) * 0.3));
    data.push({
      month: date.toLocaleString("pt-BR", { month: "short" }),
      score: Math.round(score * 10) / 10,
    });
  }
  data[data.length - 1].score = currentScore;
  return data;
}

function getMonthsAsClient(dataCadastro: string) {
  const start = new Date(dataCadastro);
  const now = new Date();
  const years = now.getFullYear() - start.getFullYear();
  const months = now.getMonth() - start.getMonth();
  return Math.max(1, years * 12 + months);
}

function formatTempo(totalMonths: number) {
  if (totalMonths >= 12) {
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    return `${y} ano${y > 1 ? "s" : ""}${m > 0 ? ` e ${m} mês${m > 1 ? "es" : ""}` : ""}`;
  }
  return `${totalMonths} mês${totalMonths > 1 ? "es" : ""}`;
}

const consentChannels = [
  { label: "Email", icon: Mail },
  { label: "WhatsApp", icon: MessageSquare },
  { label: "Phone", icon: Phone },
  { label: "SMS", icon: MessageSquare },
];

function getActiveChannels(clientId: number) {
  // Deterministic mock based on client id
  const seed = clientId * 7;
  return consentChannels.map((ch, i) => ({
    ...ch,
    active: (seed + i) % 3 !== 0,
  }));
}

const PerfilModal = ({ cliente, open, onClose }: PerfilModalProps) => {
  if (!cliente) return null;

  const engagement = getEngagementLevel(cliente.nps_score);
  const email = generateMockEmail(cliente.nome);
  const npsHistory = generateNpsHistory(cliente.nps_score);
  const totalMonths = getMonthsAsClient(cliente.data_cadastro);
  const channels = getActiveChannels(cliente.id);
  const npsTrend = npsHistory[npsHistory.length - 1].score - npsHistory[0].score;
  const totalInteracoes = 12 + (cliente.id * 3) % 20;
  const engagementRate = Math.min(95, 40 + cliente.nps_score * 5 + cliente.produtos.length * 3);
  const preferredChannel = cliente.id % 2 === 0 ? "WhatsApp" : "Email";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
        {/* Header */}
        <div className="flex items-center gap-4 border-b px-6 pb-4 pt-6">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
              {getInitials(cliente.nome)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <DialogHeader className="space-y-1">
              <DialogTitle className="flex items-center gap-2 text-xl">
                {cliente.nome}
                <span className="text-sm font-normal text-muted-foreground">#{String(cliente.id).padStart(4, "0")}</span>
              </DialogTitle>
              <DialogDescription className="sr-only">Perfil detalhado do cliente {cliente.nome}</DialogDescription>
            </DialogHeader>
            <div className="mt-1 flex flex-wrap gap-2">
              <Badge className={`border text-[10px] font-bold ${engagement.className}`}>
                {engagement.label}
              </Badge>
              <Badge
                variant="outline"
                className={
                  cliente.tipo === "Respondido"
                    ? "border-blue-200 bg-blue-50 text-blue-700 text-[10px]"
                    : "border-orange-200 bg-orange-50 text-orange-700 text-[10px]"
                }
              >
                {cliente.tipo}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-6 pb-6 pt-4">
          {/* Info Section — 3 columns */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Contact */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contatos</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{cliente.telefone}</span>
                </div>
              </div>
            </div>

            {/* Personal */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dados Pessoais</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{cliente.regiao}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Desde {new Date(cliente.data_cadastro).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Canais de Contato</h4>
              <div className="flex flex-wrap gap-1.5">
                {channels.map(ch => (
                  <Badge
                    key={ch.label}
                    variant="outline"
                    className={`gap-1 text-[10px] ${
                      ch.active
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <ch.icon className="h-3 w-3" />
                    {ch.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Products / Interests */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Produtos Contratados</h4>
            <div className="flex flex-wrap gap-2">
              {cliente.produtos.map(p => {
                const Icon = getProductIcon(p);
                return (
                  <div key={p} className="flex items-center gap-1.5 rounded-lg border bg-secondary/50 px-2.5 py-1.5 text-xs font-medium">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    {p}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Metric Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* NPS */}
            <div className="flex items-center justify-between rounded-xl border bg-card p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">NPS Score</p>
                <p className="text-2xl font-bold">{cliente.nps_score}</p>
                <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  {npsTrend >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  {npsTrend >= 0 ? "+" : ""}{npsTrend.toFixed(1)} vs 6m atrás
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>

            {/* Products */}
            <div className="flex items-center justify-between rounded-xl border bg-card p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Produtos</p>
                <p className="text-2xl font-bold">{cliente.produtos.length}</p>
                <p className="text-[10px] text-muted-foreground">produtos contratados</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Package className="h-5 w-5 text-amber-500" />
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center justify-between rounded-xl border bg-card p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tempo como Cliente</p>
                <p className="text-2xl font-bold">{totalMonths}<span className="text-sm font-normal text-muted-foreground"> meses</span></p>
                <p className="text-[10px] text-muted-foreground">{formatTempo(totalMonths)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Charts / Indicators */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* NPS Evolution */}
            <div className="rounded-xl border bg-card p-4">
              <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Evolução do NPS</h4>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={npsHistory}>
                    <Tooltip
                      contentStyle={{ fontSize: 11, borderRadius: 8 }}
                      formatter={(v: number) => [v.toFixed(1), "NPS"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-1 text-center text-[10px] text-muted-foreground">Últimos 6 meses</p>
            </div>

            {/* Interaction Frequency */}
            <div className="rounded-xl border bg-card p-4">
              <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Frequência de Interação</h4>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{totalInteracoes}</span>
                <span className="mb-1 text-xs text-muted-foreground">interações</span>
              </div>
              <Progress value={Math.min(100, totalInteracoes * 3)} className="mt-3 h-2" />
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Baixa</span>
                <span>Alta</span>
              </div>
            </div>

            {/* Engagement */}
            <div className="rounded-xl border bg-card p-4">
              <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Engajamento</h4>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{engagementRate}%</span>
              </div>
              <Progress value={engagementRate} className="mt-3 h-2" />
              <p className="mt-2 text-[10px] text-muted-foreground">
                Canal preferido: <span className="font-medium text-foreground">{preferredChannel}</span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PerfilModal;
