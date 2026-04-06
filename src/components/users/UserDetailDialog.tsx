import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/pages/modules/UsersModule";

interface Props {
  user: User | null;
  onOpenChange: () => void;
}

const UserDetailDialog = ({ user, onOpenChange }: Props) => {
  if (!user) return null;

  const fields = [
    { label: "Nom complet", value: user.nom },
    { label: "Email", value: user.email },
    { label: "Fonction", value: user.fonction },
    { label: "Service", value: user.service },
    { label: "Rôle", value: user.role },
  ];

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détail de l'utilisateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {fields.map((f) => (
            <div key={f.label} className="flex justify-between border-b border-border pb-2">
              <span className="text-sm text-muted-foreground">{f.label}</span>
              <span className="text-sm font-medium text-foreground">{f.value}</span>
            </div>
          ))}
          <div className="flex justify-between pt-1">
            <span className="text-sm text-muted-foreground">Statut</span>
            <Badge variant={user.statut === "Actif" ? "default" : "secondary"}>{user.statut}</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
