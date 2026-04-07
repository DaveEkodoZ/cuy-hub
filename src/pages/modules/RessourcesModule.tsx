import { useState } from "react";
import ModuleLayout from "@/components/ModuleLayout";
import { List, Search, Download, PlusCircle, Eye, Pencil, ToggleLeft, Trash2, Building2, Package, Layers } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { type Ressource, initialRessources } from "@/data/store";

const sidebarItems = [
  { label: "Salles & Matériel", path: "/module/ressources", icon: List },
];

const RessourcesModule = () => {
  const [ressources, setRessources] = useState<Ressource[]>(initialRessources);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Ressource | null>(null);
  const [detailItem, setDetailItem] = useState<Ressource | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({ nom: "", type: "Salle" as Ressource["type"], batiment: "", capacite: 0, etat: "Disponible" as Ressource["etat"] });

  const filtered = ressources.filter((r) => {
    const matchSearch = r.nom.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || r.type === filterType;
    return matchSearch && matchType;
  });

  const total = ressources.length;
  const totalSalles = ressources.filter((r) => r.type === "Salle").length;
  const totalMateriel = ressources.filter((r) => r.type === "Matériel").length;
  const totalDispo = ressources.filter((r) => r.etat === "Disponible").length;

  const handleAdd = () => {
    if (!form.nom) return;
    const newR: Ressource = { ...form, id: Date.now(), statut: "Actif" };
    setRessources((prev) => [...prev, newR]);
    setAddOpen(false);
    setForm({ nom: "", type: "Salle", batiment: "", capacite: 0, etat: "Disponible" });
    toast({ title: "✅ Ressource ajoutée avec succès" });
  };

  const handleEdit = () => {
    if (!editItem) return;
    setRessources((prev) => prev.map((r) => (r.id === editItem.id ? editItem : r)));
    setEditItem(null);
    toast({ title: "✅ Ressource modifiée avec succès" });
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setRessources((prev) => prev.filter((r) => r.id !== deleteId));
      setDeleteId(null);
      toast({ title: "✅ Ressource supprimée" });
    }
  };

  const toggleStatus = (id: number) => {
    setRessources((prev) =>
      prev.map((r) => r.id === id ? { ...r, statut: r.statut === "Actif" ? "Inactif" : "Actif" } : r)
    );
    toast({ title: "✅ Statut mis à jour" });
  };

  const exportCSV = () => {
    const header = ["Nom", "Type", "Bâtiment", "Capacité", "État", "Statut"];
    const rows = filtered.map((r) => [r.nom, r.type, r.batiment, r.capacite > 0 ? `${r.capacite} places` : "—", r.etat, r.statut]);
    const csv = [header, ...rows].map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ressources.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const kpis = [
    { label: "Total ressources", value: total, icon: Layers, color: "text-primary", bg: "bg-primary/10" },
    { label: "Salles", value: totalSalles, icon: Building2, color: "text-info", bg: "bg-info/10" },
    { label: "Matériel", value: totalMateriel, icon: Package, color: "text-warning", bg: "bg-warning/10" },
    { label: "Disponibles", value: totalDispo, icon: List, color: "text-success", bg: "bg-success/10" },
  ];

  return (
    <ModuleLayout title="Ressources" sidebarItems={sidebarItems}>
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
            <h2 className="text-xl font-bold text-foreground">Salles & Matériel</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Exporter</Button>
              <Button onClick={() => setAddOpen(true)}><PlusCircle className="mr-2 h-4 w-4" />Ajouter</Button>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher une ressource…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Salle">Salles</SelectItem>
                <SelectItem value="Matériel">Matériel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Bâtiment</TableHead>
                <TableHead>Capacité</TableHead>
                <TableHead>État</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.nom}</TableCell>
                  <TableCell><Badge variant="outline">{r.type}</Badge></TableCell>
                  <TableCell>{r.batiment}</TableCell>
                  <TableCell>{r.capacite > 0 ? `${r.capacite} places` : "—"}</TableCell>
                  <TableCell>
                    <Badge variant={r.etat === "Disponible" ? "default" : r.etat === "Occupée" ? "destructive" : "secondary"}>
                      {r.etat}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.statut === "Actif" ? "default" : "secondary"}>{r.statut}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Détail" onClick={() => setDetailItem(r)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" title="Modifier" onClick={() => setEditItem(r)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" title="Activer/Désactiver" onClick={() => toggleStatus(r.id)}><ToggleLeft className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" title="Supprimer" onClick={() => setDeleteId(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Aucune ressource trouvée</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter une ressource</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Ressource["type"], capacite: v === "Matériel" ? 0 : form.capacite })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salle">Salle</SelectItem>
                  <SelectItem value="Matériel">Matériel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input placeholder={form.type === "Salle" ? "Ex : Salle de conférence" : "Ex : Projecteur Epson"} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{form.type === "Salle" ? "Bâtiment" : "Emplacement"}</Label>
              <Input placeholder={form.type === "Salle" ? "Ex : Bâtiment A" : "Ex : Stock"} value={form.batiment} onChange={(e) => setForm({ ...form, batiment: e.target.value })} />
            </div>
            {form.type === "Salle" && (
              <div className="space-y-2">
                <Label>Capacité (places)</Label>
                <Input type="number" min={0} value={form.capacite} onChange={(e) => setForm({ ...form, capacite: Number(e.target.value) })} />
              </div>
            )}
            <div className="space-y-2">
              <Label>État</Label>
              <Select value={form.etat} onValueChange={(v) => setForm({ ...form, etat: v as Ressource["etat"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="Occupée">Occupée</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
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

      {/* Edit Dialog */}
      {editItem && (
        <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Modifier la ressource</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={editItem.type} onValueChange={(v) => setEditItem({ ...editItem, type: v as Ressource["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salle">Salle</SelectItem>
                    <SelectItem value="Matériel">Matériel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input value={editItem.nom} onChange={(e) => setEditItem({ ...editItem, nom: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{editItem.type === "Salle" ? "Bâtiment" : "Emplacement"}</Label>
                <Input value={editItem.batiment} onChange={(e) => setEditItem({ ...editItem, batiment: e.target.value })} />
              </div>
              {editItem.type === "Salle" && (
                <div className="space-y-2">
                  <Label>Capacité</Label>
                  <Input type="number" value={editItem.capacite} onChange={(e) => setEditItem({ ...editItem, capacite: Number(e.target.value) })} />
                </div>
              )}
              <div className="space-y-2">
                <Label>État</Label>
                <Select value={editItem.etat} onValueChange={(v) => setEditItem({ ...editItem, etat: v as Ressource["etat"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponible">Disponible</SelectItem>
                    <SelectItem value="Occupée">Occupée</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            <DialogHeader><DialogTitle>Détail de la ressource</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              {[
                { label: "Nom", value: detailItem.nom },
                { label: "Type", value: detailItem.type },
                { label: "Bâtiment", value: detailItem.batiment },
                { label: "Capacité", value: detailItem.capacite > 0 ? `${detailItem.capacite} places` : "—" },
                { label: "État", value: detailItem.etat },
              ].map((f) => (
                <div key={f.label} className="flex justify-between border-b border-border pb-2">
                  <span className="text-sm text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium text-foreground">{f.value}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge variant={detailItem.statut === "Actif" ? "default" : "secondary"}>{detailItem.statut}</Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Confirmation requise</AlertDialogTitle>
            <AlertDialogDescription>Voulez-vous vraiment supprimer cette ressource ? Cette action est irréversible.</AlertDialogDescription>
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

export default RessourcesModule;
