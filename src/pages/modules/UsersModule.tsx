import { useState } from "react";
import ModuleLayout from "@/components/ModuleLayout";
import { List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UsersKPI from "@/components/users/UsersKPI";
import UsersToolbar from "@/components/users/UsersToolbar";
import UsersTable from "@/components/users/UsersTable";
import AddUserDialog from "@/components/users/AddUserDialog";
import EditUserDialog from "@/components/users/EditUserDialog";
import UserDetailDialog from "@/components/users/UserDetailDialog";
import DeleteUserDialog from "@/components/users/DeleteUserDialog";

const sidebarItems = [
  { label: "Liste des utilisateurs", path: "/module/utilisateurs", icon: List },
];

export interface User {
  id: number;
  nom: string;
  email: string;
  fonction: string;
  service: string;
  role: "ADMIN" | "GESTIONNAIRE" | "AGENT" | "SUPERVISEUR";
  statut: "Actif" | "Inactif";
}

const initialUsers: User[] = [
  { id: 1, nom: "Jean Nkoulou", email: "j.nkoulou@cuy.cm", fonction: "Chef de service", service: "Urbanisme", role: "ADMIN", statut: "Actif" },
  { id: 2, nom: "Marie Eyinga", email: "m.eyinga@cuy.cm", fonction: "Secrétaire", service: "Administration", role: "AGENT", statut: "Actif" },
  { id: 3, nom: "Paul Mbarga", email: "p.mbarga@cuy.cm", fonction: "Technicien", service: "Voirie", role: "GESTIONNAIRE", statut: "Inactif" },
  { id: 4, nom: "Claire Atangana", email: "c.atangana@cuy.cm", fonction: "Directrice", service: "Communication", role: "SUPERVISEUR", statut: "Actif" },
  { id: 5, nom: "David Onana", email: "d.onana@cuy.cm", fonction: "Agent", service: "Finances", role: "AGENT", statut: "Actif" },
];

const UsersModule = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const services = [...new Set(users.map((u) => u.service))];

  const filtered = users.filter((u) => {
    const matchSearch = u.nom.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
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

  const handleAddUser = (data: Omit<User, "id" | "statut">) => {
    const newUser: User = { ...data, id: Date.now(), statut: "Actif" };
    setUsers((prev) => [...prev, newUser]);
    setAddOpen(false);
    toast({ title: "✅ Utilisateur ajouté avec succès" });
  };

  const handleEditUser = (data: User) => {
    setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
    setEditUser(null);
    toast({ title: "✅ Utilisateur modifié avec succès" });
  };

  const totalUsers = users.length;
  const totalActif = users.filter((u) => u.statut === "Actif").length;
  const totalInactif = users.filter((u) => u.statut === "Inactif").length;

  return (
    <ModuleLayout title="Utilisateurs" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <UsersKPI total={totalUsers} actif={totalActif} inactif={totalInactif} />
        <UsersToolbar
          search={search}
          onSearchChange={setSearch}
          filterService={filterService}
          onFilterChange={setFilterService}
          services={services}
          onAdd={() => setAddOpen(true)}
          users={filtered}
        />
        <UsersTable
          users={filtered}
          onDetail={setDetailUser}
          onEdit={setEditUser}
          onToggle={toggleStatus}
          onDelete={setDeleteId}
        />
      </div>

      <AddUserDialog open={addOpen} onOpenChange={setAddOpen} services={services} onSubmit={handleAddUser} />
      <EditUserDialog user={editUser} onOpenChange={() => setEditUser(null)} services={services} onSubmit={handleEditUser} />
      <UserDetailDialog user={detailUser} onOpenChange={() => setDetailUser(null)} />
      <DeleteUserDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} />
    </ModuleLayout>
  );
};

export default UsersModule;
