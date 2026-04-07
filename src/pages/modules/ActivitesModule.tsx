import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ModuleLayout from "@/components/ModuleLayout";
import { Activity, FileText, PlusCircle, Eye, Pencil, ToggleLeft, Trash2, CalendarCheck, Clock, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { type Activite, type NoteService, initialActivites, initialNotes } from "@/data/store";
import cuyLogo from "@/assets/cuy-logo.png";

const sidebarItems = [
  { label: "Activités", path: "/module/activites", icon: Activity },
  { label: "Notes de service", path: "/module/activites/notes", icon: FileText },
];

// --- Activites Tab ---
const ActivitesTab = () => {
  const [items, setItems] = useState<Activite[]>(initialActivites);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Activite | null>(null);
  const [detailItem, setDetailItem] = useState<Activite | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const emptyForm = { titre: "", date: "", lieu: "", description: "", statut: "À venir" as Activite["statut"] };
  const [form, setForm] = useState(emptyForm);

  const total = items.length;
  const aVenir = items.filter((a) => a.statut === "À venir").length;
  const terminees = items.filter((a) => a.statut === "Terminée").length;

  const handleAdd = () => {
    if (!form.titre) return;
    setItems((prev) => [...prev, { ...form, id: Date.now(), activeStatus: "Actif" }]);
    setAddOpen(false);
    setForm(emptyForm);
    toast({ title: "✅ Activité ajoutée" });
  };

  const handleEdit = () => {
    if (!editItem) return;
    setItems((prev) => prev.map((a) => (a.id === editItem.id ? editItem : a)));
    setEditItem(null);
    toast({ title: "✅ Activité modifiée" });
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setItems((prev) => prev.filter((a) => a.id !== deleteId));
      setDeleteId(null);
      toast({ title: "✅ Activité supprimée" });
    }
  };

  const toggleStatus = (id: number) => {
    setItems((prev) => prev.map((a) => a.id === id ? { ...a, activeStatus: a.activeStatus === "Actif" ? "Inactif" : "Actif" } : a));
    toast({ title: "✅ Statut mis à jour" });
  };

  const kpis = [
    { label: "Total activités", value: total, icon: Layers, color: "text-primary", bg: "bg-primary/10" },
    { label: "À venir", value: aVenir, icon: CalendarCheck, color: "text-info", bg: "bg-info/10" },
    { label: "Terminées", value: terminees, icon: Clock, color: "text-success", bg: "bg-success/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {kpis.map((c) => (
          <div key={c.label} className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-card">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${c.bg}`}>
              <c.icon className={`h-6 w-6 ${c.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Activités</h2>
        <Button onClick={() => setAddOpen(true)}><PlusCircle className="mr-2 h-4 w-4" />Nouvelle activité</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((a) => (
          <div key={a.id} className={`rounded-xl border bg-card p-5 shadow-card ${a.activeStatus === "Inactif" ? "opacity-50" : ""}`}>
            <div className="mb-3 flex items-center gap-3">
              <img src={cuyLogo} alt="CUY" className="h-10 w-10 rounded-lg object-contain" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Badge variant={a.statut === "À venir" ? "default" : "secondary"}>{a.statut}</Badge>
                  <span className="text-xs text-muted-foreground">{a.date}</span>
                </div>
              </div>
            </div>
            <h3 className="mb-1 font-semibold text-card-foreground">{a.titre}</h3>
            <p className="text-sm text-muted-foreground">📍 {a.lieu}</p>
            <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>
            <div className="mt-3 flex items-center gap-1 border-t border-border pt-3">
              <Button variant="ghost" size="icon" title="Détail" onClick={() => setDetailItem(a)}><Eye className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" title="Modifier" onClick={() => setEditItem(a)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" title="Activer/Désactiver" onClick={() => toggleStatus(a.id)}><ToggleLeft className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" title="Supprimer" onClick={() => setDeleteId(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter une activité</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Titre</Label><Input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div className="space-y-2"><Label>Lieu</Label><Input value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v as Activite["statut"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="À venir">À venir</SelectItem>
                  <SelectItem value="Terminée">Terminée</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <DialogHeader><DialogTitle>Modifier l'activité</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Titre</Label><Input value={editItem.titre} onChange={(e) => setEditItem({ ...editItem, titre: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={editItem.date} onChange={(e) => setEditItem({ ...editItem, date: e.target.value })} /></div>
                <div className="space-y-2"><Label>Lieu</Label><Input value={editItem.lieu} onChange={(e) => setEditItem({ ...editItem, lieu: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditItem(null)}>Annuler</Button>
              <Button onClick={handleEdit}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Detail */}
      {detailItem && (
        <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Détail de l'activité</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              {[
                { label: "Titre", value: detailItem.titre },
                { label: "Date", value: detailItem.date },
                { label: "Lieu", value: detailItem.lieu },
                { label: "Description", value: detailItem.description },
              ].map((f) => (
                <div key={f.label} className="flex justify-between border-b border-border pb-2">
                  <span className="text-sm text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium text-foreground max-w-[60%] text-right">{f.value}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge variant={detailItem.statut === "À venir" ? "default" : "secondary"}>{detailItem.statut}</Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Confirmation requise</AlertDialogTitle>
            <AlertDialogDescription>Voulez-vous vraiment supprimer cette activité ?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// --- Notes de Service Tab ---
const NotesTab = () => {
  const [items, setItems] = useState<NoteService[]>(initialNotes);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<NoteService | null>(null);
  const [detailItem, setDetailItem] = useState<NoteService | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const emptyForm = { titre: "", auteur: "", date: "", contenu: "" };
  const [form, setForm] = useState(emptyForm);

  const total = items.length;
  const actifs = items.filter((n) => n.activeStatus === "Actif").length;

  const handleAdd = () => {
    if (!form.titre) return;
    setItems((prev) => [...prev, { ...form, id: Date.now(), activeStatus: "Actif" }]);
    setAddOpen(false);
    setForm(emptyForm);
    toast({ title: "✅ Note ajoutée" });
  };

  const handleEdit = () => {
    if (!editItem) return;
    setItems((prev) => prev.map((n) => (n.id === editItem.id ? editItem : n)));
    setEditItem(null);
    toast({ title: "✅ Note modifiée" });
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setItems((prev) => prev.filter((n) => n.id !== deleteId));
      setDeleteId(null);
      toast({ title: "✅ Note supprimée" });
    }
  };

  const toggleStatus = (id: number) => {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, activeStatus: n.activeStatus === "Actif" ? "Inactif" : "Actif" } : n));
    toast({ title: "✅ Statut mis à jour" });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"><Layers className="h-6 w-6 text-primary" /></div>
          <div><p className="text-2xl font-bold text-card-foreground">{total}</p><p className="text-sm text-muted-foreground">Total notes</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10"><CalendarCheck className="h-6 w-6 text-success" /></div>
          <div><p className="text-2xl font-bold text-card-foreground">{actifs}</p><p className="text-sm text-muted-foreground">Notes actives</p></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Notes de service</h2>
        <Button onClick={() => setAddOpen(true)}><PlusCircle className="mr-2 h-4 w-4" />Nouvelle note</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((n) => (
          <div key={n.id} className={`rounded-xl border bg-card p-5 shadow-card ${n.activeStatus === "Inactif" ? "opacity-50" : ""}`}>
            <div className="mb-3 flex items-center gap-3">
              <img src={cuyLogo} alt="CUY" className="h-10 w-10 rounded-lg object-contain" />
              <div className="flex-1">
                <p className="text-xs font-medium text-primary">{n.auteur}</p>
                <p className="text-xs text-muted-foreground">{n.date}</p>
              </div>
            </div>
            <h3 className="mb-2 font-semibold text-card-foreground">{n.titre}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{n.contenu}</p>
            <div className="mt-3 flex items-center gap-1 border-t border-border pt-3">
              <Button variant="ghost" size="icon" title="Détail" onClick={() => setDetailItem(n)}><Eye className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" title="Modifier" onClick={() => setEditItem(n)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" title="Activer/Désactiver" onClick={() => toggleStatus(n.id)}><ToggleLeft className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" title="Supprimer" onClick={() => setDeleteId(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter une note de service</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Titre</Label><Input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Auteur / Service</Label><Input value={form.auteur} onChange={(e) => setForm({ ...form, auteur: e.target.value })} /></div>
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Contenu</Label><Textarea value={form.contenu} onChange={(e) => setForm({ ...form, contenu: e.target.value })} /></div>
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
            <DialogHeader><DialogTitle>Modifier la note</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Titre</Label><Input value={editItem.titre} onChange={(e) => setEditItem({ ...editItem, titre: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Auteur</Label><Input value={editItem.auteur} onChange={(e) => setEditItem({ ...editItem, auteur: e.target.value })} /></div>
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={editItem.date} onChange={(e) => setEditItem({ ...editItem, date: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Contenu</Label><Textarea value={editItem.contenu} onChange={(e) => setEditItem({ ...editItem, contenu: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditItem(null)}>Annuler</Button>
              <Button onClick={handleEdit}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Detail */}
      {detailItem && (
        <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Détail de la note</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              {[
                { label: "Titre", value: detailItem.titre },
                { label: "Auteur", value: detailItem.auteur },
                { label: "Date", value: detailItem.date },
                { label: "Contenu", value: detailItem.contenu },
              ].map((f) => (
                <div key={f.label} className="flex justify-between border-b border-border pb-2">
                  <span className="text-sm text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium text-foreground max-w-[60%] text-right">{f.value}</span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Confirmation requise</AlertDialogTitle>
            <AlertDialogDescription>Voulez-vous vraiment supprimer cette note ?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// --- Main ---
const ActivitesModule = () => (
  <ModuleLayout title="Activités & Notes de service" sidebarItems={sidebarItems}>
    <Routes>
      <Route index element={<ActivitesTab />} />
      <Route path="notes" element={<NotesTab />} />
    </Routes>
  </ModuleLayout>
);

export default ActivitesModule;
