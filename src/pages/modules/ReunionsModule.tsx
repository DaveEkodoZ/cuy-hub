import ModuleLayout from "@/components/ModuleLayout";
import { CalendarDays, List, PlusCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const sidebarItems = [
  { label: "Liste des réunions", path: "/module/reunions", icon: List },
  { label: "Calendrier", path: "/module/reunions/calendrier", icon: CalendarDays },
  { label: "Créer une réunion", path: "/module/reunions/creer", icon: PlusCircle },
  { label: "Comptes rendus", path: "/module/reunions/comptes-rendus", icon: FileText },
];

const reunions = [
  { titre: "Coordination mensuelle", date: "07/04/2026", heure: "09:00", salle: "Salle du Conseil", statut: "À venir" },
  { titre: "Comité technique voirie", date: "10/04/2026", heure: "14:00", salle: "Salle B", statut: "À venir" },
  { titre: "Réunion budget Q2", date: "02/04/2026", heure: "10:00", salle: "Salle A", statut: "Terminée" },
  { titre: "Point sécurité", date: "28/03/2026", heure: "11:00", salle: "Salle C", statut: "Terminée" },
];

const ReunionsModule = () => (
  <ModuleLayout title="Réunions" sidebarItems={sidebarItems}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Liste des réunions</h2>
        <Button><PlusCircle className="mr-2 h-4 w-4" />Nouvelle réunion</Button>
      </div>

      <div className="rounded-xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Heure</TableHead>
              <TableHead>Salle</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reunions.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{r.titre}</TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.heure}</TableCell>
                <TableCell>{r.salle}</TableCell>
                <TableCell>
                  <Badge variant={r.statut === "À venir" ? "default" : "secondary"}>
                    {r.statut}
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

export default ReunionsModule;
