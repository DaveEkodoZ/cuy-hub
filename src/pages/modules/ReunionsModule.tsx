import { useState, useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ModuleLayout from "@/components/ModuleLayout";
import { List, CalendarDays, FileText, BarChart3, Search, Download, PlusCircle, Eye, Pencil, ToggleLeft, Trash2, CalendarCheck, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
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
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { type Reunion, type Ressource, initialReunions, initialRessources, isResourceAvailable } from "@/data/store";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import cuyLogo from "@/assets/cuy-logo.png";

const sidebarItems = [
  { label: "Liste des réunions", path: "/module/reunions", icon: List },
  { label: "Calendrier", path: "/module/reunions/calendrier", icon: CalendarDays },
  { label: "Comptes rendus", path: "/module/reunions/comptes-rendus", icon: FileText },
  { label: "Statistiques", path: "/module/reunions/statistiques", icon: BarChart3 },
];

// --- List View ---
const ReunionsList = ({
  reunions, setReunions, ressources
}: {
  reunions: Reunion[];
  setReunions: React.Dispatch<React.SetStateAction<Reunion[]>>;
  ressources: Ressource[];
}) => {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Reunion | null>(null);
  const [detailItem, setDetailItem] = useState<Reunion | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const emptyForm = { titre: "", date: "", heureDebut: "", heureFin: "", salle: "", materiel: [] as string[], organisateur: "", participants: "" };
  const [form, setForm] = useState(emptyForm);

  const filtered = reunions.filter((r) => r.titre.toLowerCase().includes(search.toLowerCase()));

  const total = reunions.length;
  const aVenir = reunions.filter((r) => r.statut === "À venir").length;
  const terminees = reunions.filter((r) => r.statut === "Terminée").length;
  const annulees = reunions.filter((r) => r.statut === "Annulée").length;

  // Get available salles and materiel for the selected date/time
  const availableSalles = useMemo(() => {
    if (!form.date || !form.heureDebut || !form.heureFin) return ressources.filter((r) => r.type === "Salle" && r.statut === "Actif" && r.etat !== "Maintenance");
    return ressources.filter((r) => {
      if (r.type !== "Salle" || r.statut !== "Actif" || r.etat === "Maintenance") return false;
      if (r.etat === "Disponible") return true;
      return isResourceAvailable(r.nom, form.date, form.heureDebut, form.heureFin, reunions);
    });
  }, [form.date, form.heureDebut, form.heureFin, ressources, reunions]);

  const availableMateriel = useMemo(() => {
    if (!form.date || !form.heureDebut || !form.heureFin) return ressources.filter((r) => r.type === "Matériel" && r.statut === "Actif" && r.etat !== "Maintenance");
    return ressources.filter((r) => {
      if (r.type !== "Matériel" || r.statut !== "Actif" || r.etat === "Maintenance") return false;
      if (r.etat === "Disponible") return true;
      return isResourceAvailable(r.nom, form.date, form.heureDebut, form.heureFin, reunions);
    });
  }, [form.date, form.heureDebut, form.heureFin, ressources, reunions]);

  const handleAdd = () => {
    if (!form.titre || !form.date || !form.heureDebut || !form.heureFin) return;
    const newR: Reunion = { ...form, id: Date.now(), statut: "À venir" };
    setReunions((prev) => [...prev, newR]);
    setAddOpen(false);
    setForm(emptyForm);
    toast({ title: "✅ Réunion créée avec succès" });
  };

  const handleEdit = () => {
    if (!editItem) return;
    setReunions((prev) => prev.map((r) => (r.id === editItem.id ? editItem : r)));
    setEditItem(null);
    toast({ title: "✅ Réunion modifiée" });
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setReunions((prev) => prev.filter((r) => r.id !== deleteId));
      setDeleteId(null);
      toast({ title: "✅ Réunion supprimée" });
    }
  };

  const toggleStatus = (id: number) => {
    setReunions((prev) =>
      prev.map((r) => r.id === id ? { ...r, statut: r.statut === "Annulée" ? "À venir" : "Annulée" } : r)
    );
    toast({ title: "✅ Statut mis à jour" });
  };

  const exportCSV = () => {
    const header = ["Titre", "Date", "Heure début", "Heure fin", "Salle", "Organisateur", "Statut"];
    const rows = filtered.map((r) => [r.titre, r.date, r.heureDebut, r.heureFin, r.salle, r.organisateur, r.statut]);
    const csv = [header, ...rows].map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reunions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const kpis = [
    { label: "Total réunions", value: total, icon: List, color: "text-primary", bg: "bg-primary/10" },
    { label: "À venir", value: aVenir, icon: CalendarCheck, color: "text-info", bg: "bg-info/10" },
    { label: "Terminées", value: terminees, icon: Clock, color: "text-success", bg: "bg-success/10" },
    { label: "Annulées", value: annulees, icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI */}
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

      {/* Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-foreground">Liste des réunions</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Exporter</Button>
            <Button onClick={() => setAddOpen(true)}><PlusCircle className="mr-2 h-4 w-4" />Nouvelle réunion</Button>
          </div>
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher une réunion…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Début</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Salle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.titre}</TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.heureDebut}</TableCell>
                <TableCell>{r.heureFin}</TableCell>
                <TableCell>{r.salle}</TableCell>
                <TableCell>
                  <Badge variant={r.statut === "À venir" ? "default" : r.statut === "Terminée" ? "secondary" : "destructive"}>
                    {r.statut}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" title="Détail" onClick={() => setDetailItem(r)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Modifier" onClick={() => setEditItem(r)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Activer/Annuler" onClick={() => toggleStatus(r.id)}><ToggleLeft className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Supprimer" onClick={() => setDeleteId(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Aucune réunion trouvée</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Créer une réunion</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Titre</Label><Input placeholder="Ex : Comité de direction" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div className="space-y-2"><Label>Heure début</Label><Input type="time" value={form.heureDebut} onChange={(e) => setForm({ ...form, heureDebut: e.target.value })} /></div>
              <div className="space-y-2"><Label>Heure fin</Label><Input type="time" value={form.heureFin} onChange={(e) => setForm({ ...form, heureFin: e.target.value })} /></div>
            </div>
            <div className="space-y-2">
              <Label>Salle</Label>
              <Select value={form.salle} onValueChange={(v) => setForm({ ...form, salle: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner une salle" /></SelectTrigger>
                <SelectContent>
                  {availableSalles.map((s) => (
                    <SelectItem key={s.id} value={s.nom}>{s.nom} ({s.capacite} places)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.date && form.heureDebut && form.heureFin && availableSalles.length === 0 && (
                <p className="text-xs text-destructive">Aucune salle disponible pour ce créneau</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Matériel</Label>
              <div className="flex flex-wrap gap-2">
                {availableMateriel.map((m) => (
                  <Button key={m.id} type="button" size="sm" variant={form.materiel.includes(m.nom) ? "default" : "outline"}
                    onClick={() => setForm({ ...form, materiel: form.materiel.includes(m.nom) ? form.materiel.filter((x) => x !== m.nom) : [...form.materiel, m.nom] })}>
                    {m.nom}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2"><Label>Organisateur</Label><Input placeholder="Ex : Secrétariat Général" value={form.organisateur} onChange={(e) => setForm({ ...form, organisateur: e.target.value })} /></div>
            <div className="space-y-2"><Label>Participants</Label><Input placeholder="Ex : Tous les chefs de service" value={form.participants} onChange={(e) => setForm({ ...form, participants: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Annuler</Button>
            <Button onClick={handleAdd}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editItem && (
        <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Modifier la réunion</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Titre</Label><Input value={editItem.titre} onChange={(e) => setEditItem({ ...editItem, titre: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={editItem.date} onChange={(e) => setEditItem({ ...editItem, date: e.target.value })} /></div>
                <div className="space-y-2"><Label>Début</Label><Input type="time" value={editItem.heureDebut} onChange={(e) => setEditItem({ ...editItem, heureDebut: e.target.value })} /></div>
                <div className="space-y-2"><Label>Fin</Label><Input type="time" value={editItem.heureFin} onChange={(e) => setEditItem({ ...editItem, heureFin: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Salle</Label><Input value={editItem.salle} onChange={(e) => setEditItem({ ...editItem, salle: e.target.value })} /></div>
              <div className="space-y-2"><Label>Organisateur</Label><Input value={editItem.organisateur} onChange={(e) => setEditItem({ ...editItem, organisateur: e.target.value })} /></div>
              <div className="space-y-2"><Label>Participants</Label><Input value={editItem.participants} onChange={(e) => setEditItem({ ...editItem, participants: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditItem(null)}>Annuler</Button>
              <Button onClick={handleEdit}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Detail Dialog */}
      {detailItem && (
        <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Détail de la réunion</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              {[
                { label: "Titre", value: detailItem.titre },
                { label: "Date", value: detailItem.date },
                { label: "Heure début", value: detailItem.heureDebut },
                { label: "Heure fin", value: detailItem.heureFin },
                { label: "Salle", value: detailItem.salle },
                { label: "Matériel", value: detailItem.materiel.length > 0 ? detailItem.materiel.join(", ") : "Aucun" },
                { label: "Organisateur", value: detailItem.organisateur },
                { label: "Participants", value: detailItem.participants },
              ].map((f) => (
                <div key={f.label} className="flex justify-between border-b border-border pb-2">
                  <span className="text-sm text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium text-foreground">{f.value}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge variant={detailItem.statut === "À venir" ? "default" : detailItem.statut === "Terminée" ? "secondary" : "destructive"}>{detailItem.statut}</Badge>
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
            <AlertDialogDescription>Voulez-vous vraiment supprimer cette réunion ?</AlertDialogDescription>
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

// --- Calendar View ---
const CalendarView = ({ reunions }: { reunions: Reunion[] }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();

  const reunionDates = new Set(reunions.map((r) => r.date));

  const getReunionsForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    return reunions.filter((r) => r.date === dateStr);
  };

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    navigate(`/module/reunions/jour/${y}-${m}-${d}`);
  };

  const today = new Date();
  const upcomingReunions = reunions
    .filter((r) => r.date >= today.toISOString().slice(0, 10) && r.statut === "À venir")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Calendrier des réunions</h2>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar - takes 2 columns */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-8 shadow-card">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            modifiers={{
              hasReunion: (date) => {
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, "0");
                const d = String(date.getDate()).padStart(2, "0");
                return reunionDates.has(`${y}-${m}-${d}`);
              },
            }}
            modifiersClassNames={{ hasReunion: "!bg-primary/20 !text-primary !font-bold ring-2 ring-primary/30" }}
            className="w-full [&_.rdp-months]:w-full [&_.rdp-month]:w-full [&_.rdp-table]:w-full [&_.rdp-head_cell]:w-[14.28%] [&_.rdp-head_cell]:text-sm [&_.rdp-head_cell]:font-semibold [&_.rdp-cell]:w-[14.28%] [&_.rdp-cell]:h-14 [&_.rdp-day]:h-12 [&_.rdp-day]:w-12 [&_.rdp-day]:text-base [&_.rdp-caption_label]:text-lg [&_.rdp-caption_label]:font-bold [&_.rdp-nav_button]:h-9 [&_.rdp-nav_button]:w-9"
          />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            🗓️ Cliquez sur un jour pour voir les réunions programmées — Les jours avec réunions sont surlignés en vert
          </p>
        </div>

        {/* Upcoming sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Prochaines réunions
            </h3>
            {upcomingReunions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune réunion à venir</p>
            ) : (
              <div className="space-y-3">
                {upcomingReunions.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border/50 bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
                    <p className="font-medium text-sm text-card-foreground">{r.titre}</p>
                    <p className="text-xs text-muted-foreground mt-1">📅 {r.date} · {r.heureDebut} - {r.heureFin}</p>
                    <p className="text-xs text-muted-foreground">📍 {r.salle}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-2xl border bg-primary/5 p-5">
            <p className="text-sm text-primary font-medium">💡 Astuce</p>
            <p className="text-xs text-muted-foreground mt-1">Les jours surlignés en vert contiennent au moins une réunion. Cliquez pour en voir les détails.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Day View ---
const DayView = ({ reunions, dateStr }: { reunions: Reunion[]; dateStr: string }) => {
  const dayReunions = reunions.filter((r) => r.date === dateStr);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/module/reunions/calendrier")}>← Retour au calendrier</Button>
        <h2 className="text-xl font-bold text-foreground">Réunions du {dateStr}</h2>
      </div>
      {dayReunions.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center shadow-card">
          <p className="text-muted-foreground">Aucune réunion programmée ce jour</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {dayReunions.map((r) => (
            <div key={r.id} className="rounded-xl border bg-card p-5 shadow-card">
              <div className="mb-2 flex items-center justify-between">
                <Badge variant={r.statut === "À venir" ? "default" : "secondary"}>{r.statut}</Badge>
                <span className="text-xs text-muted-foreground">{r.heureDebut} - {r.heureFin}</span>
              </div>
              <h3 className="mb-1 font-semibold text-card-foreground">{r.titre}</h3>
              <p className="text-sm text-muted-foreground">📍 {r.salle}</p>
              <p className="text-sm text-muted-foreground">👤 {r.organisateur}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Comptes Rendus ---
const ComptesRendus = ({ reunions, setReunions }: { reunions: Reunion[]; setReunions: React.Dispatch<React.SetStateAction<Reunion[]>> }) => {
  const [addOpen, setAddOpen] = useState(false);
  const [selectedReunionId, setSelectedReunionId] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const terminated = reunions.filter((r) => r.statut === "Terminée");

  const handleAdd = () => {
    if (!selectedReunionId || !fileName) return;
    const id = Number(selectedReunionId);
    setReunions((prev) => prev.map((r) => r.id === id ? { ...r, compteRendu: fileName } : r));
    setAddOpen(false);
    setSelectedReunionId("");
    setFileName("");
    toast({ title: "✅ Compte rendu ajouté" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Comptes rendus</h2>
        <Button onClick={() => setAddOpen(true)}><PlusCircle className="mr-2 h-4 w-4" />Ajouter un compte rendu</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {terminated.map((r) => (
          <div key={r.id} className="rounded-xl border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center gap-3">
              <img src={cuyLogo} alt="CUY" className="h-10 w-10 rounded-lg object-contain" />
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">{r.titre}</h3>
                <p className="text-xs text-muted-foreground">{r.date} · {r.heureDebut} - {r.heureFin}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">📍 {r.salle} · 👤 {r.organisateur}</p>
            {r.compteRendu ? (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/5 p-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{r.compteRendu}</span>
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground italic">Aucun compte rendu</p>
            )}
          </div>
        ))}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter un compte rendu</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Réunion</Label>
              <Select value={selectedReunionId} onValueChange={setSelectedReunionId}>
                <SelectTrigger><SelectValue placeholder="Sélectionner une réunion" /></SelectTrigger>
                <SelectContent>
                  {terminated.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>{r.titre} — {r.date}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fichier PDF (nom)</Label>
              <Input type="text" placeholder="Ex : CR_reunion_budget_Q2.pdf" value={fileName} onChange={(e) => setFileName(e.target.value)} />
              <p className="text-xs text-muted-foreground">Saisissez le nom du fichier PDF du compte rendu</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Annuler</Button>
            <Button onClick={handleAdd}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- Stats ---
const StatsView = ({ reunions }: { reunions: Reunion[] }) => {
  const byDay = useMemo(() => {
    const map: Record<string, number> = {};
    reunions.forEach((r) => { map[r.date] = (map[r.date] || 0) + 1; });
    return Object.entries(map).sort().slice(-10).map(([date, count]) => ({ date, count }));
  }, [reunions]);

  const bySalle = useMemo(() => {
    const map: Record<string, number> = {};
    reunions.forEach((r) => { if (r.salle) map[r.salle] = (map[r.salle] || 0) + 1; });
    return Object.entries(map).map(([salle, count]) => ({ salle, count })).sort((a, b) => b.count - a.count);
  }, [reunions]);

  const COLORS = ["hsl(145,65%,42%)", "hsl(43,80%,52%)", "hsl(210,60%,50%)", "hsl(0,72%,51%)", "hsl(280,60%,50%)"];

  const total = reunions.length;
  const aVenir = reunions.filter((r) => r.statut === "À venir").length;
  const terminees = reunions.filter((r) => r.statut === "Terminée").length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Statistiques des réunions</h2>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total réunions", value: total },
          { label: "À venir", value: aVenir },
          { label: "Terminées", value: terminees },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border bg-card p-5 shadow-card text-center">
            <p className="text-3xl font-bold text-primary">{k.value}</p>
            <p className="text-sm text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-semibold text-card-foreground">Réunions par jour</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byDay}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(145,65%,42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-semibold text-card-foreground">Salles les plus utilisées</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={bySalle} dataKey="count" nameKey="salle" cx="50%" cy="50%" outerRadius={80} label>
                {bySalle.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- Main Module ---
const ReunionsModule = () => {
  const [reunions, setReunions] = useState<Reunion[]>(initialReunions);
  const [ressources] = useState<Ressource[]>(initialRessources);

  return (
    <ModuleLayout title="Réunions" sidebarItems={sidebarItems}>
      <Routes>
        <Route index element={<ReunionsList reunions={reunions} setReunions={setReunions} ressources={ressources} />} />
        <Route path="calendrier" element={<CalendarView reunions={reunions} />} />
        <Route path="jour/:dateStr" element={<DayViewWrapper reunions={reunions} />} />
        <Route path="comptes-rendus" element={<ComptesRendus reunions={reunions} setReunions={setReunions} />} />
        <Route path="statistiques" element={<StatsView reunions={reunions} />} />
      </Routes>
    </ModuleLayout>
  );
};

// wrapper to extract param
import { useParams } from "react-router-dom";
const DayViewWrapper = ({ reunions }: { reunions: Reunion[] }) => {
  const { dateStr } = useParams();
  return <DayView reunions={reunions} dateStr={dateStr || ""} />;
};

export default ReunionsModule;
