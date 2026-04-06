import ModuleLayout from "@/components/ModuleLayout";
import { Building2, List, CalendarDays, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const sidebarItems = [
  { label: "Salles & Matériel", path: "/module/ressources", icon: List },
  { label: "Calendrier", path: "/module/ressources/calendrier", icon: CalendarDays },
  { label: "Ajouter", path: "/module/ressources/ajouter", icon: PlusCircle },
];

const ressources = [
  { nom: "Salle du Conseil", batiment: "Bâtiment A", capacite: 50, etat: "Disponible" },
  { nom: "Salle B", batiment: "Bâtiment A", capacite: 20, etat: "Occupée" },
  { nom: "Salle C", batiment: "Bâtiment B", capacite: 15, etat: "Disponible" },
  { nom: "Projecteur HP", batiment: "Stock", capacite: 0, etat: "Disponible" },
  { nom: "Salle VIP", batiment: "Bâtiment A", capacite: 30, etat: "Maintenance" },
];

const RessourcesModule = () => (
  <ModuleLayout title="Ressources" sidebarItems={sidebarItems}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Salles & Matériel</h2>
        <Button><PlusCircle className="mr-2 h-4 w-4" />Ajouter</Button>
      </div>
      <div className="rounded-xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Bâtiment</TableHead>
              <TableHead>Capacité</TableHead>
              <TableHead>État</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ressources.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{r.nom}</TableCell>
                <TableCell>{r.batiment}</TableCell>
                <TableCell>{r.capacite > 0 ? `${r.capacite} places` : "—"}</TableCell>
                <TableCell>
                  <Badge variant={r.etat === "Disponible" ? "default" : r.etat === "Occupée" ? "destructive" : "secondary"}>
                    {r.etat}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  </ModuleLayout>
);

export default RessourcesModule;
