import { useState } from "react";
import ModuleLayout from "@/components/ModuleLayout";
import { List, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { type AgentPresence, initialAgents } from "@/data/store";

const sidebarItems = [
  { label: "Annuaire", path: "/module/presence", icon: List },
];

const statusColor: Record<string, string> = {
  "Présent": "🟢",
  "Absent": "🔴",
  "Réunion": "🟡",
  "Déplacement": "🔵",
};

const PresenceModule = () => {
  const [agents, setAgents] = useState<AgentPresence[]>(initialAgents);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<AgentPresence | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const emptyForm = { nom: "", service: "", statut: "Présent" as AgentPresence["statut"], dateAbsence: "", heureDebut: "", heureFin: "", motif: "" };
  const [form, setForm] = useState(emptyForm);

  const handleAdd = () => {
    if (!form.nom) return;
    setAgents((prev) => [...prev, { ...form, id: Date.now() }]);
    setAddOpen(false);
    setForm(emptyForm);
    toast({ title: "✅ Agent ajouté" });
  };

  const handleEdit = () => {
    if (!editItem) return;
    setAgents((prev) => prev.map((a) => (a.id === editItem.id ? editItem : a)));
    setEditItem(null);
    toast({ title: "✅ Agent modifié" });
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setAgents((prev) => prev.filter((a) => a.id !== deleteId));
      setDeleteId(null);
      toast({ title: "✅ Agent supprimé" });
    }
  };

  const showTimeFields = (statut: string) => statut !== "Présent";

  return (
    <ModuleLayout title="Présence" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Annuaire des agents</h2>
          <Button onClick={() => setAddOpen(true)}><PlusCircle className="mr-2 h-4 w-4" />Ajouter</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => (
            <div key={a.id} className="rounded-xl border bg-card p-4 shadow-card">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {a.nom[0]}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-card-foreground">{a.nom}</p>
                  <p className="text-xs text-muted-foreground">{a.service}</p>
                </div>
                <Badge variant="outline">{statusColor[a.statut]} {a.statut}</Badge>
              </div>
              {a.statut !== "Présent" && (
                <div className="mt-3 space-y-1 rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
                  {a.dateAbsence && <p>📅 Date : {a.dateAbsence}</p>}
                  {a.heureDebut && a.heureFin && <p>🕐 {a.heureDebut} - {a.heureFin}</p>}
                  {a.motif && <p>📝 Motif : {a.motif}</p>}
                </div>
              )}
              <div className="mt-3 flex items-center gap-1 border-t border-border pt-2">
                <Button variant="ghost" size="icon" title="Modifier" onClick={() => setEditItem(a)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" title="Supprimer" onClick={() => setDeleteId(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter un agent</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Nom complet</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
            <div className="space-y-2"><Label>Service</Label><Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v as AgentPresence["statut"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Présent">Présent</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Réunion">Réunion</SelectItem>
                  <SelectItem value="Déplacement">Déplacement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {showTimeFields(form.statut) && (
              <>
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.dateAbsence} onChange={(e) => setForm({ ...form, dateAbsence: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Heure début</Label><Input type="time" value={form.heureDebut} onChange={(e) => setForm({ ...form, heureDebut: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Heure fin</Label><Input type="time" value={form.heureFin} onChange={(e) => setForm({ ...form, heureFin: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>Motif</Label><Input value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} /></div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Annuler</Button>
            <Button onClick={handleAdd}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      {editItem && (
        <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Modifier l'agent</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Nom</Label><Input value={editItem.nom} onChange={(e) => setEditItem({ ...editItem, nom: e.target.value })} /></div>
              <div className="space-y-2"><Label>Service</Label><Input value={editItem.service} onChange={(e) => setEditItem({ ...editItem, service: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select value={editItem.statut} onValueChange={(v) => setEditItem({ ...editItem, statut: v as AgentPresence["statut"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Présent">Présent</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                    <SelectItem value="Réunion">Réunion</SelectItem>
                    <SelectItem value="Déplacement">Déplacement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {showTimeFields(editItem.statut) && (
                <>
                  <div className="space-y-2"><Label>Date</Label><Input type="date" value={editItem.dateAbsence || ""} onChange={(e) => setEditItem({ ...editItem, dateAbsence: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2"><Label>Début</Label><Input type="time" value={editItem.heureDebut || ""} onChange={(e) => setEditItem({ ...editItem, heureDebut: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Fin</Label><Input type="time" value={editItem.heureFin || ""} onChange={(e) => setEditItem({ ...editItem, heureFin: e.target.value })} /></div>
                  </div>
                  <div className="space-y-2"><Label>Motif</Label><Input value={editItem.motif || ""} onChange={(e) => setEditItem({ ...editItem, motif: e.target.value })} /></div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditItem(null)}>Annuler</Button>
              <Button onClick={handleEdit}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Confirmation requise</AlertDialogTitle>
            <AlertDialogDescription>Voulez-vous vraiment supprimer cet agent ?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ModuleLayout>
  );
};

export default PresenceModule;
