import ModuleLayout from "@/components/ModuleLayout";
import { BarChart3, TrendingUp, CalendarDays, Building2 } from "lucide-react";

const sidebarItems = [
  { label: "Vue d'ensemble", path: "/module/statistiques", icon: BarChart3 },
  { label: "Tendances", path: "/module/statistiques/tendances", icon: TrendingUp },
];

const stats = [
  { label: "Réunions ce mois", value: "24", icon: CalendarDays, change: "+12%" },
  { label: "Taux d'occupation salles", value: "73%", icon: Building2, change: "+5%" },
  { label: "Notes publiées", value: "18", icon: BarChart3, change: "+8%" },
  { label: "Agents actifs", value: "142", icon: TrendingUp, change: "+2%" },
];

const StatsModule = () => (
  <ModuleLayout title="Tableau de bord" sidebarItems={sidebarItems}>
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Vue d'ensemble</h2>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-success">{s.change}</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </ModuleLayout>
);

export default StatsModule;
