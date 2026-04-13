import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ModuleLayout from "@/components/ModuleLayout";
import { Megaphone, PlusCircle, Eye, Pencil, ToggleLeft, Trash2, CalendarCheck, Clock, Layers } from "lucide-react";
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
  { label: "Annonces", path: "/module/activites", icon: Megaphone },
];

// --- Annonces Tab (combines Activites + Notes) ---
const AnnoncesTab = () => {
  const [activites, setActivites] = useState<Activite[]>(initialActivites);
  const [notes, setNotes] = useState<NoteService[]>(initialNotes);
  const [addActOpen, setAddActOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [editAct, setEditAct] = useState<Activite | null>(null);
  const [editNote, setEditNote] = useState<NoteService | null>(null);
  const [detailAct, setDetailAct] = useState<Activite | null>(null);
  const [detailNote, setDetailNote] = useState<NoteService | null>(null);
  const [deleteActId, setDeleteActId] = useState<number | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);
  const { toast } = useToast();

  const emptyActForm = { titre: "", date: "", lieu: "", description: "", statut: "À venir" as Activite["statut"] };
  const [actForm, setActForm] = useState(emptyActForm);
  const emptyNoteForm = { titre: "", auteur: "", date: "", contenu: "" };
  const [noteForm, setNoteForm] = useState(emptyNoteForm);

  const totalAct = activites.length;
  const totalNotes = notes.length;
  const actActives = activites.filter((a) => a.activeStatus === "Actif").length;
  const notesActives = notes.filter((n) => n.activeStatus === "Actif").length;

  const handleAddAct = () => {
    if (!actForm.titre) return;
    setActivites((prev) => [...prev, { ...actForm, id: Date.now(), activeStatus: "Actif" }]);
    setAddActOpen(false);
    setActForm(emptyActForm);
    toast({ title: "✅ Activité ajoutée" });
  };

  const handleAddNote = () => {
    if (!noteForm.titre) return;
    setNotes((prev) => [...prev, { ...noteForm, id: Date.now(), activeStatus: "Actif" }]);
    setAddNoteOpen(false);
    setNoteForm(emptyNoteForm);
    toast({ title: "✅ Note ajoutée" });
  };

  const handleEditAct = () => {
    if (!editAct) return;
    setActivites((prev) => prev.map((a) => (a.id === editAct.id ? editAct : a)));
    setEditAct(null);
    toast({ title: "✅ Activité modifiée" });
  };

  const handleEditNote = () => {
    if (!editNote) return;
    setNotes((prev) => prev.map((n) => (n.id === editNote.id ? editNote : n)));
    setEditNote(null);
    toast({ title: "✅ Note modifiée" });
  };

  const toggleActStatus = (id: number) => {
    setActivites((prev) => prev.map((a) => a.id === id ? { ...a, activeStatus: a.activeStatus === "Actif" ? "Inactif" : "Actif" } : a));
    toast({ title: "✅ Statut mis à jour" });
  };

  const toggleNoteStatus = (id: number) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, activeStatus: n.activeStatus === "Actif" ? "Inactif" : "Actif" } : n));
    toast({ title: "✅ Statut mis à jour" });
  };

  const kpis = [
    { label: "Total activités", value: totalAct, icon: Layers, color: "text-primary", bg: "bg-primary/10" },
    { label: "Activités actives", value: actActives, icon: CalendarCheck, color: "text-success", bg: "bg-success/10" },
    { label: "Total notes", value: totalNotes, icon: Megaphone, color: "text-info", bg: "bg-info/10" },
    { label: "Notes actives", value: notesActives, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  ];

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Activités Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Activités</h2>
          <Button onClick={() => setAddActOpen(true)}><PlusCircle className="mr-2 h-4 w-4" />Nouvelle activité</Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {activites.map((a) => (
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
                <Button variant="ghost" size="icon" title="Détail" onClick={() => setDetailAct(a)}><Eye className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" title="Modifier" onClick={() => setEditAct(a)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" title="Activer/Désactiver" onClick={() => toggleActStatus(a.id)}><ToggleLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" title="Supprimer" onClick={() => setDeleteActId(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes de service Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Notes de service</h2>
          <Button onClick={() => setAddNoteOpen(true)}><PlusCircle className="mr-2 h-4 w-4" />Nouvelle note</Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map((n) => (
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
                <Button variant="ghost" size="icon" title="Détail" onClick={() => setDetailNote(n)}><Eye className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" title="Modifier" onClick={() => setEditNote(n)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" title="Activer/Désactiver" onClick={() => toggleNoteStatus(n.id)}><ToggleLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" title="Supprimer" onClick={() => setDeleteNoteId(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Activité Dialog */}
      <Dialog open={addActOpen} onOpenChange={setAddActOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter une activité</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Titre</Label><Input value={actForm.titre} onChange={(e) => setActForm({ ...actForm, titre: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={actForm.date} onChange={(e) => setActForm({ ...actForm, date: e.target.value })} /></div>
              <div className="space-y-2"><Label>Lieu</Label><Input value={actForm.lieu} onChange={(e) => setActForm({ ...actForm, lieu: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={actForm.description} onChange={(e) => setActForm({ ...actForm, description: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={actForm.statut} onValueChange={(v) => setActForm({ ...actForm, statut: v as Activite["statut"] })}>
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
            <Button variant="outline" onClick={() => setAddActOpen(false)}>Annuler</Button>
            <Button onClick={handleAddAct}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={addNoteOpen} onOpenChange={setAddNoteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter une note de service</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Titre</Label><Input value={noteForm.titre} onChange={(e) => setNoteForm({ ...noteForm, titre: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Auteur / Service</Label><Input value={noteForm.auteur} onChange={(e) => setNoteForm({ ...noteForm, auteur: e.target.value })} /></div>
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={noteForm.date} onChange={(e) => setNoteForm({ ...noteForm, date: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Contenu</Label><Textarea value={noteForm.contenu} onChange={(e) => setNoteForm({ ...noteForm, contenu: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddNoteOpen(false)}>Annuler</Button>
            <Button onClick={handleAddNote}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Activité */}
      {editAct && (
        <Dialog open={!!editAct} onOpenChange={() => setEditAct(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Modifier l'activité</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Titre</Label><Input value={editAct.titre} onChange={(e) => setEditAct({ ...editAct, titre: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={editAct.date} onChange={(e) => setEditAct({ ...editAct, date: e.target.value })} /></div>
                <div className="space-y-2"><Label>Lieu</Label><Input value={editAct.lieu} onChange={(e) => setEditAct({ ...editAct, lieu: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={editAct.description} onChange={(e) => setEditAct({ ...editAct, description: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditAct(null)}>Annuler</Button>
              <Button onClick={handleEditAct}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Note */}
      {editNote && (
        <Dialog open={!!editNote} onOpenChange={() => setEditNote(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Modifier la note</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Titre</Label><Input value={editNote.titre} onChange={(e) => setEditNote({ ...editNote, titre: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Auteur</Label><Input value={editNote.auteur} onChange={(e) => setEditNote({ ...editNote, auteur: e.target.value })} /></div>
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={editNote.date} onChange={(e) => setEditNote({ ...editNote, date: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Contenu</Label><Textarea value={editNote.contenu} onChange={(e) => setEditNote({ ...editNote, contenu: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditNote(null)}>Annuler</Button>
              <Button onClick={handleEditNote}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Detail Activité */}
      {detailAct && (
        <Dialog open={!!detailAct} onOpenChange={() => setDetailAct(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Détail de l'activité</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              {[
                { label: "Titre", value: detailAct.titre },
                { label: "Date", value: detailAct.date },
                { label: "Lieu", value: detailAct.lieu },
                { label: "Description", value: detailAct.description },
              ].map((f) => (
                <div key={f.label} className="flex justify-between border-b border-border pb-2">
                  <span className="text-sm text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium text-foreground max-w-[60%] text-right">{f.value}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge variant={detailAct.statut === "À venir" ? "default" : "secondary"}>{detailAct.statut}</Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Detail Note */}
      {detailNote && (
        <Dialog open={!!detailNote} onOpenChange={() => setDetailNote(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Détail de la note</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              {[
                { label: "Titre", value: detailNote.titre },
                { label: "Auteur", value: detailNote.auteur },
                { label: "Date", value: detailNote.date },
                { label: "Contenu", value: detailNote.contenu },
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

      {/* Delete Activité */}
      <AlertDialog open={deleteActId !== null} onOpenChange={() => setDeleteActId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Confirmation requise</AlertDialogTitle>
            <AlertDialogDescription>Voulez-vous vraiment supprimer cette activité ?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setActivites((prev) => prev.filter((a) => a.id !== deleteActId)); setDeleteActId(null); toast({ title: "✅ Activité supprimée" }); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Note */}
      <AlertDialog open={deleteNoteId !== null} onOpenChange={() => setDeleteNoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Confirmation requise</AlertDialogTitle>
            <AlertDialogDescription>Voulez-vous vraiment supprimer cette note ?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setNotes((prev) => prev.filter((n) => n.id !== deleteNoteId)); setDeleteNoteId(null); toast({ title: "✅ Note supprimée" }); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// --- Main Module ---
const ActivitesModule = () => {
  return (
    <ModuleLayout title="Annonces et activités" sidebarItems={sidebarItems}>
      <Routes>
        <Route index element={<AnnoncesTab />} />
      </Routes>
    </ModuleLayout>
  );
};

export default ActivitesModule;
