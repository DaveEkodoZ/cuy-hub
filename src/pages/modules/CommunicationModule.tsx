import ModuleLayout from "@/components/ModuleLayout";
import { Megaphone, FileText, CalendarDays, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sidebarItems = [
  { label: "Fil d'actualité", path: "/module/communication", icon: Newspaper },
  { label: "Notes de service", path: "/module/communication/notes", icon: FileText },
  { label: "Activités", path: "/module/communication/activites", icon: CalendarDays },
  { label: "Publier", path: "/module/communication/publier", icon: Megaphone },
];

const posts = [
  {
    type: "note" as const,
    title: "Réorganisation des services techniques",
    auteur: "Direction Générale",
    date: "05 Avril 2026",
    contenu: "Suite à la délibération du conseil, les services techniques seront réorganisés à compter du 15 avril 2026. Tous les chefs de service sont priés de prendre les dispositions nécessaires.",
  },
  {
    type: "activite" as const,
    title: "Journée de l'arbre – Plantation au Lac Municipal",
    auteur: "Service Environnement",
    date: "03 Avril 2026",
    contenu: "Une journée de reboisement est organisée le samedi 12 avril au bord du Lac Municipal. Tous les agents sont invités à y participer.",
  },
  {
    type: "reunion" as const,
    title: "Réunion de coordination mensuelle",
    auteur: "Secrétariat Général",
    date: "01 Avril 2026",
    contenu: "La réunion de coordination du mois d'avril se tiendra le lundi 7 avril à 9h en salle du Conseil. Ordre du jour : bilan trimestriel.",
  },
  {
    type: "note" as const,
    title: "Mise à jour du règlement intérieur",
    auteur: "Direction des Ressources Humaines",
    date: "28 Mars 2026",
    contenu: "Le nouveau règlement intérieur entre en vigueur le 1er avril 2026. Une copie est disponible auprès de chaque chef de service.",
  },
];

const typeBadge = {
  note: { label: "📢 Note de service", variant: "default" as const },
  activite: { label: "📅 Activité", variant: "secondary" as const },
  reunion: { label: "🧑‍💼 Réunion", variant: "outline" as const },
};

const CommunicationModule = () => {
  return (
    <ModuleLayout title="Communication" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Fil d'actualité</h2>
          <p className="text-sm text-muted-foreground">Communications internes et notes de service</p>
        </div>

        <div className="space-y-4">
          {posts.map((post, i) => {
            const badge = typeBadge[post.type];
            return (
              <article
                key={i}
                className="rounded-xl border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <h3 className="mb-1 text-lg font-semibold text-card-foreground">{post.title}</h3>
                <p className="mb-2 text-xs font-medium text-primary">{post.auteur}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{post.contenu}</p>
              </article>
            );
          })}
        </div>
      </div>
    </ModuleLayout>
  );
};

export default CommunicationModule;
