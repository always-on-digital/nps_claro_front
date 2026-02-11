import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, GeoJSON, useMap } from "react-leaflet";
import type { Localizacao } from "@/data/localizacao";
import type { CityCoords } from "@/data/citiesData";
import { getCategoriaColor } from "@/data/mockData";
import { MapPin, Globe } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface MapaBrasilProps {
  localizacoes: (Localizacao & CityCoords)[];
  selectedCidade: string | null;
  selectedEstado?: string | null;
  onSelectCidade: (cidade: string | null, estado: string | null) => void;
}

function getMarkerRadius(totalClientes: number, isSelected: boolean): number {
  const base = Math.max(6, Math.min(18, totalClientes / 2000));
  return isSelected ? base + 4 : base;
}

function cssVarToHex(cssVar: string): string {
  const map: Record<string, string> = {
    "var(--chart-promoter)": "#00C853",
    "var(--chart-neutral)": "#FFD600",
    "var(--chart-detractor)": "#E30613",
  };
  return map[cssVar] ?? "#888";
}

/** Fly to a selected city or reset to Brazil view */
function MapController({ selectedCidade, localizacoes }: { selectedCidade: string | null; localizacoes: (Localizacao & CityCoords)[] }) {
  const map = useMap();
  useMemo(() => {
    if (selectedCidade) {
      const r = localizacoes.find((reg) => reg.city === selectedCidade);
      if (r && r.latitude && r.longitude) map.flyTo([r.latitude, r.longitude], 8, { duration: 1 });
    } else {
      map.flyTo([-14.5, -52], 4, { duration: 1 });
    }
  }, [selectedCidade, localizacoes, map]);
  return null;
}

const BRAZIL_BOUNDS: [[number, number], [number, number]] = [
  [5.3, -73.9],
  [-33.8, -34.8],
];

/** Simple GeoJSON outline of Brazil (approximate) */
function BrazilHighlight() {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    // Fetch Brazil boundary from a public GeoJSON source
    fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        const brazil = data.features.find(
          (f: any) => f.properties.ADMIN === "Brazil" || f.properties.ISO_A3 === "BRA"
        );
        if (brazil) setGeoData(brazil);
      })
      .catch(() => {
        // Silently fail - map still works without the highlight
      });
  }, []);

  if (!geoData) return null;

  return (
    <GeoJSON
      data={geoData}
      style={{
        color: "#E30613",
        weight: 2,
        fillColor: "#E30613",
        fillOpacity: 0.05,
        dashArray: "4 2",
      }}
    />
  );
}

const MapaBrasil = ({ localizacoes, selectedCidade, selectedEstado, onSelectCidade }: MapaBrasilProps) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  return (
    <div className="relative rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <h3 className="px-4 pt-4 pb-2 text-sm font-semibold text-foreground">Mapa de NPS por Região</h3>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px]">
        {/* Leaflet Map */}
        <div className="relative h-[300px] sm:h-[400px] md:h-[480px]">
          <MapContainer
            center={[-14.5, -52]}
            zoom={4}
            className="h-full w-full z-0"
            scrollWheelZoom
            zoomControl
            maxBounds={BRAZIL_BOUNDS}
            minZoom={3}
            style={{ background: "#f8f9fa" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <BrazilHighlight />
            <MapController selectedCidade={selectedCidade} localizacoes={localizacoes} />

            {localizacoes.map((loc) => {
              const color = "#00C853";
              const isSelected = selectedCidade === loc.city || (!!selectedEstado && loc.state === selectedEstado);
              const isHovered = hoveredState === loc.state;
              const radius = getMarkerRadius(loc.quantidade, isSelected || isHovered);
              if (!loc.latitude || !loc.longitude) return null;
              return (
                <CircleMarker
                  key={loc.city}
                  center={[loc.latitude, loc.longitude]}
                  radius={radius}
                  pathOptions={{
                    color: isSelected ? "#333" : color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.9 : 0.7,
                    weight: isSelected ? 3 : 1.5,
                  }}
                  eventHandlers={{
                    click: () => onSelectCidade(loc.city, loc.state),
                    mouseover: () => setHoveredState(loc.state),
                    mouseout: () => setHoveredState(null),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -radius]} opacity={0.95}>
                    <div className="text-xs">
                      <p className="font-bold">{loc.city} - {loc.state}</p>
                      <p>{loc.quantidade.toLocaleString("pt-BR")} clientes</p>
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Region list sidebar */}
        <div className="border-t lg:border-t-0 lg:border-l border-border p-3 overflow-y-auto max-h-[200px] sm:max-h-[400px] md:max-h-[480px]">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Estados</p>
          <div className="flex flex-row flex-wrap gap-1 lg:flex-col lg:flex-nowrap">
            <button
              onClick={() => onSelectCidade(null, null)}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11px] transition-colors w-full ${
                !selectedCidade
                  ? "bg-accent font-semibold text-accent-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              <Globe className="h-3 w-3 flex-shrink-0 text-primary" />
              <span className="truncate">Brasil</span>
            </button>
            {/* Sidebar de estados únicos */}
            {(() => {
              const unique: { state: string; region: string; city: string; latitude: number|null; longitude: number|null; quantidade: number }[] = [];
              localizacoes.forEach((loc) => {
                if (!unique.some(u => u.state === loc.state)) {
                  unique.push({
                    state: loc.state,
                    region: loc.region,
                    city: loc.city,
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    quantidade: loc.quantidade
                  });
                }
              });
              return unique.map((e) => {
                const color = "#00C853";
                const isActive = selectedEstado === e.state;
                return (
                  <button
                    key={e.state}
                    onClick={() => {
                      if (isActive) {
                        onSelectCidade(null, null);
                      } else {
                        onSelectCidade(e.city, e.state);
                      }
                    }}
                    className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11px] transition-colors w-full ${
                      isActive
                        ? "bg-accent font-semibold text-accent-foreground"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <MapPin className="h-3 w-3 flex-shrink-0" style={{ color }} />
                    <span className="truncate">{e.state} - {e.city}</span>
                    <span className="ml-auto font-bold" style={{ color }}>
                      {e.quantidade}
                    </span>
                  </button>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaBrasil;
