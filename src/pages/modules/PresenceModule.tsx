import ModuleLayout from "@/components/ModuleLayout";
import { MapPin, List, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sidebarItems = [
  { label: "Annuaire", path: "/module/presence", icon: List },
  { label: "Pointage", path: "/module/presence/pointage", icon: UserCheck },
];

const agents = [
  { nom: "Jean Nkoulou", service: "Urbanisme", statut: "Présent" },
  { nom: "Marie Eyinga", service: "Administration", statut: "Réunion" },
  { nom: "Paul Mbarga", service: "Voirie", statut: "Absent" },
  { nom: "Claire Atangana", service: "Communication", statut: "Présent" },
  { nom: "David Onana", service: "Finances", statut: "Déplacement" },
  { nom: "Suzanne Fouda", service: "Urbanisme", statut: "Présent" },
];

const statusColor: Record<string, string> = {
  "Présent": "🟢",
  "Absent": "🔴",
  "Réunion": "🟡",
  "Déplacement": "🔵",
};

const PresenceModule = () => (
  <ModuleLayout title="Présence" sidebarItems={sidebarItems}>
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Annuaire des agents</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((a, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {a.nom[0]}
            </div>
            <div className="flex-1">
              <p className="font-medium text-card-foreground">{a.nom}</p>
              <p className="text-xs text-muted-foreground">{a.service}</p>
            </div>
            <Badge variant="outline">
              {statusColor[a.statut]} {a.statut}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  </ModuleLayout>
);

export default PresenceModule;
