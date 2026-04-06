import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/pages/modules/UsersModule";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  services: string[];
  onSubmit: (data: Omit<User, "id" | "statut">) => void;
}

const roles: User["role"][] = ["ADMIN", "GESTIONNAIRE", "SUPERVISEUR", "AGENT"];

const AddUserDialog = ({ open, onOpenChange, services, onSubmit }: Props) => {
  const [form, setForm] = useState({ nom: "", email: "", fonction: "", service: "", role: "" as User["role"], password: "" });

  const handleSubmit = () => {
    if (!form.nom || !form.email || !form.role) return;
    onSubmit({ nom: form.nom, email: form.email, fonction: form.fonction, service: form.service, role: form.role });
    setForm({ nom: "", email: "", fonction: "", service: "", role: "" as User["role"], password: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nom complet</Label>
            <Input placeholder="Ex : Jean Dupont" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email professionnel</Label>
            <Input type="email" placeholder="nom@cuy.cm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Mot de passe</Label>
            <Input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Fonction</Label>
            <Input placeholder="Ex : Chef de service" value={form.fonction} onChange={(e) => setForm({ ...form, fonction: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Service</Label>
            <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un service" /></SelectTrigger>
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
              <SelectTrigger><SelectValue placeholder="Sélectionner un rôle" /></SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
