import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import {
  Users,
  Building2,
  CalendarDays,
  Megaphone,
  Activity,
  MapPin,
  BarChart3,
} from "lucide-react";

const modules = [
  { icon: Users, title: "Gestion des utilisateurs", desc: "Gérer les comptes, rôles et accès des agents", path: "/module/utilisateurs" },
  { icon: Building2, title: "Gestion des ressources", desc: "Salles, matériel et calendrier de réservation", path: "/module/ressources" },
  { icon: CalendarDays, title: "Gestion des réunions", desc: "Planifier, inviter et rédiger les comptes rendus", path: "/module/reunions" },
  { icon: Megaphone, title: "Communication interne", desc: "Notes de service, activités et fil d'actualité", path: "/module/communication" },
  { icon: Activity, title: "Activités", desc: "Événements passés, en cours et à venir", path: "/module/activites" },
  { icon: MapPin, title: "Présence des agents", desc: "Statut et localisation interne des agents", path: "/module/presence" },
  { icon: BarChart3, title: "Tableau de bord", desc: "Statistiques et indicateurs de performance", path: "/module/statistiques" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue sur la plateforme UrbaLink</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map((mod) => (
            <button
              key={mod.path}
              onClick={() => navigate(mod.path)}
              className="group flex flex-col rounded-xl border bg-card p-6 text-left shadow-card transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <mod.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-1 font-semibold text-card-foreground">{mod.title}</h3>
              <p className="mb-4 flex-1 text-sm text-muted-foreground">{mod.desc}</p>
              <span className="text-sm font-medium text-primary group-hover:underline">
                Ouvrir →
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
