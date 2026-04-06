import { Search, UserPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { User } from "@/pages/modules/UsersModule";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  filterService: string;
  onFilterChange: (v: string) => void;
  services: string[];
  onAdd: () => void;
  users: User[];
}

const UsersToolbar = ({ search, onSearchChange, filterService, onFilterChange, services, onAdd, users }: Props) => {
  const exportExcel = () => {
    const header = ["Nom", "Email", "Fonction", "Service", "Rôle", "Statut"];
    const rows = users.map((u) => [u.nom, u.email, u.fonction, u.service, u.role, u.statut]);
    const csv = [header, ...rows].map((r) => r.join(";")).join("\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "utilisateurs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-foreground">Liste des utilisateurs</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportExcel}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={onAdd}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un utilisateur…" value={search} onChange={(e) => onSearchChange(e.target.value)} className="pl-10" />
        </div>
        <Select value={filterService} onValueChange={onFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les services</SelectItem>
            {services.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UsersToolbar;
