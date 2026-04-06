import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/pages/modules/UsersModule";

interface Props {
  user: User | null;
  onOpenChange: () => void;
  services: string[];
  onSubmit: (data: User) => void;
}

const roles: User["role"][] = ["ADMIN", "GESTIONNAIRE", "SUPERVISEUR", "AGENT"];

const EditUserDialog = ({ user, onOpenChange, services, onSubmit }: Props) => {
  const [form, setForm] = useState<User | null>(null);

  useEffect(() => {
    setForm(user ? { ...user } : null);
  }, [user]);

  if (!form) return null;

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nom complet</Label>
            <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Fonction</Label>
            <Input value={form.fonction} onChange={(e) => setForm({ ...form, fonction: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Service</Label>
            <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Rôle</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as User["role"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>Annuler</Button>
          <Button onClick={() => onSubmit(form)}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
