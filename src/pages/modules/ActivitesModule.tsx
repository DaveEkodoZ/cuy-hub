import ModuleLayout from "@/components/ModuleLayout";
import { Activity, List, PlusCircle, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Activités", path: "/module/activites", icon: List },
  { label: "Créer", path: "/module/activites/creer", icon: PlusCircle },
  { label: "Archives", path: "/module/activites/archives", icon: Archive },
];

const activites = [
  { titre: "Journée de l'arbre", date: "12/04/2026", lieu: "Lac Municipal", statut: "À venir" },
  { titre: "Formation sécurité incendie", date: "08/04/2026", lieu: "Salle du Conseil", statut: "À venir" },
  { titre: "Nettoyage quartier Melen", date: "25/03/2026", lieu: "Melen", statut: "Terminée" },
  { titre: "Cérémonie de fin d'année", date: "20/12/2025", lieu: "Hôtel de Ville", statut: "Terminée" },
];

const ActivitesModule = () => (
  <ModuleLayout title="Activités" sidebarItems={sidebarItems}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Activités</h2>
        <Button><PlusCircle className="mr-2 h-4 w-4" />Nouvelle activité</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {activites.map((a, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 shadow-card">
            <div className="mb-2 flex items-center justify-between">
              <Badge variant={a.statut === "À venir" ? "default" : "secondary"}>{a.statut}</Badge>
              <span className="text-xs text-muted-foreground">{a.date}</span>
            </div>
            <h3 className="mb-1 font-semibold text-card-foreground">{a.titre}</h3>
            <p className="text-sm text-muted-foreground">📍 {a.lieu}</p>
          </div>
        ))}
      </div>
    </div>
  </ModuleLayout>
);

export default ActivitesModule;
