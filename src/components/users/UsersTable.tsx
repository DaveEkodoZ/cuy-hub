import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, ToggleLeft, Trash2 } from "lucide-react";
import type { User } from "@/pages/modules/UsersModule";

interface Props {
  users: User[];
  onDetail: (u: User) => void;
  onEdit: (u: User) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const UsersTable = ({ users, onDetail, onEdit, onToggle, onDelete }: Props) => (
  <div className="rounded-xl border bg-card shadow-card">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Fonction</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.nom}</TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell>{user.fonction}</TableCell>
            <TableCell>{user.service}</TableCell>
            <TableCell>
              <Badge variant="outline">{user.role}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.statut === "Actif" ? "default" : "secondary"}>
                {user.statut}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" title="Détail" onClick={() => onDetail(user)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Modifier" onClick={() => onEdit(user)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Activer/Désactiver" onClick={() => onToggle(user.id)}>
                  <ToggleLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Supprimer" onClick={() => onDelete(user.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
              Aucun utilisateur trouvé
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

export default UsersTable;
