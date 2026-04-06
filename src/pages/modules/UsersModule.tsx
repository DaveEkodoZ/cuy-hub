import { useState } from "react";
import ModuleLayout from "@/components/ModuleLayout";
import { Users, UserPlus, Shield, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Pencil, Trash2, ToggleLeft } from "lucide-react";

const sidebarItems = [
  { label: "Liste des utilisateurs", path: "/module/utilisateurs", icon: List },
  { label: "Ajouter un utilisateur", path: "/module/utilisateurs/ajouter", icon: UserPlus },
  { label: "Rôles & Permissions", path: "/module/utilisateurs/roles", icon: Shield },
];

interface User {
  id: number;
  nom: string;
  fonction: string;
  service: string;
  statut: "Actif" | "Inactif";
}

const initialUsers: User[] = [
  { id: 1, nom: "Jean Nkoulou", fonction: "Chef de service", service: "Urbanisme", statut: "Actif" },
  { id: 2, nom: "Marie Eyinga", fonction: "Secrétaire", service: "Administration", statut: "Actif" },
  { id: 3, nom: "Paul Mbarga", fonction: "Technicien", service: "Voirie", statut: "Inactif" },
  { id: 4, nom: "Claire Atangana", fonction: "Directrice", service: "Communication", statut: "Actif" },
  { id: 5, nom: "David Onana", fonction: "Agent", service: "Finances", statut: "Actif" },
];

const UsersModule = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const services = [...new Set(users.map((u) => u.service))];

  const filtered = users.filter((u) => {
    const matchSearch = u.nom.toLowerCase().includes(search.toLowerCase());
    const matchService = filterService === "all" || u.service === filterService;
    return matchSearch && matchService;
  });

  const handleDelete = () => {
    if (deleteId !== null) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      toast({ title: "✅ Utilisateur supprimé" });
      setDeleteId(null);
    }
  };

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, statut: u.statut === "Actif" ? "Inactif" : "Actif" } : u
      )
    );
    toast({ title: "✅ Statut mis à jour" });
  };

  return (
    <ModuleLayout title="Utilisateurs" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-foreground">Liste des utilisateurs</h2>
          <Button onClick={() => setDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterService} onValueChange={setFilterService}>
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

        {/* Table */}
        <div className="rounded-xl border bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Fonction</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nom}</TableCell>
                  <TableCell>{user.fonction}</TableCell>
                  <TableCell>{user.service}</TableCell>
                  <TableCell>
                    <Badge variant={user.statut === "Actif" ? "default" : "secondary"}>
                      {user.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Modifier">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Activer/Désactiver" onClick={() => toggleStatus(user.id)}>
                        <ToggleLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Supprimer" onClick={() => setDeleteId(user.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <Input placeholder="Ex : Jean Dupont" />
            </div>
            <div className="space-y-2">
              <Label>Fonction</Label>
              <Input placeholder="Ex : Chef de service" />
            </div>
            <div className="space-y-2">
              <Label>Service</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Sélectionner un service" /></SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Email professionnel</Label>
              <Input type="email" placeholder="nom@cuy.cm" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={() => { setDialogOpen(false); toast({ title: "✅ Utilisateur ajouté avec succès" }); }}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Confirmation requise</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ModuleLayout>
  );
};

export default UsersModule;
