import AppHeader from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Megaphone, Activity, ChevronLeft, ArrowRight } from "lucide-react";
import cuyLogo from "@/assets/cuy-logo.png";
import { initialActivites, initialNotes, initialReunions } from "@/data/store";

const CommunicationModule = () => {
  const navigate = useNavigate();

  // Combine all into a feed sorted by date
  const feed = [
    ...initialNotes.map((n) => ({
      id: `note-${n.id}`,
      type: "note" as const,
      titre: n.titre,
      auteur: n.auteur,
      date: n.date,
      contenu: n.contenu,
    })),
    ...initialActivites.map((a) => ({
      id: `act-${a.id}`,
      type: "activite" as const,
      titre: a.titre,
      auteur: a.lieu,
      date: a.date,
      contenu: a.description,
    })),
    ...initialReunions.map((r) => ({
      id: `reu-${r.id}`,
      type: "reunion" as const,
      titre: r.titre,
      auteur: r.organisateur,
      date: r.date,
      contenu: `${r.heureDebut} - ${r.heureFin} · ${r.salle} · ${r.participants}`,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const typeBadge = {
    note: { label: "📢 Note de service", variant: "default" as const, icon: Megaphone },
    activite: { label: "📅 Activité", variant: "secondary" as const, icon: Activity },
    reunion: { label: "🧑‍💼 Réunion", variant: "outline" as const, icon: CalendarDays },
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="gradient-primary py-16">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <div className="mb-6 flex justify-center">
              <img src={cuyLogo} alt="CUY" className="h-20 w-20 rounded-2xl bg-white/90 p-2 shadow-lg" />
            </div>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl">
              Communication Interne
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/80">
              Fil d'actualité officiel de la Communauté Urbaine de Yaoundé — Restez informé des notes de service, activités et réunions.
            </p>
            <div className="mt-6">
              <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={() => navigate("/dashboard")}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Retour au tableau de bord
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute -bottom-1 left-0 w-full">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mx-auto -mt-2 max-w-5xl px-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Notes de service", count: initialNotes.length, icon: Megaphone, color: "text-primary", bg: "bg-primary/10" },
            { label: "Activités", count: initialActivites.length, icon: Activity, color: "text-warning", bg: "bg-warning/10" },
            { label: "Réunions", count: initialReunions.length, icon: CalendarDays, color: "text-info", bg: "bg-info/10" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-card">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${s.bg}`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{s.count}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="mb-6 text-xl font-bold text-foreground">Fil d'actualité</h2>
        <div className="space-y-5">
          {feed.map((post, i) => {
            const badge = typeBadge[post.type];
            return (
              <article
                key={post.id}
                className="group rounded-xl border bg-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-4">
                  <img src={cuyLogo} alt="CUY" className="h-12 w-12 rounded-xl bg-muted p-1.5 object-contain" />
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {post.titre}
                    </h3>
                    <p className="mb-2 text-xs font-medium text-primary">{post.auteur}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{post.contenu}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src={cuyLogo} alt="CUY" className="h-8 w-8 object-contain" />
            <span className="font-semibold text-card-foreground">UrbaLink</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Communauté Urbaine de Yaoundé — Plateforme interne
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CommunicationModule;
