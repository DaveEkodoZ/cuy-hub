import AppHeader from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Megaphone, Activity, ChevronLeft, ArrowRight, Sparkles, TrendingUp, Clock } from "lucide-react";
import cuyLogo from "@/assets/cuy-logo.png";
import { initialActivites, initialNotes, initialReunions } from "@/data/store";
import { useState } from "react";

const CommunicationModule = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "note" | "activite" | "reunion">("all");

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

  const filtered = filter === "all" ? feed : feed.filter((f) => f.type === filter);

  const typeBadge = {
    note: { label: "📢 Note de service", variant: "default" as const, icon: Megaphone, gradient: "from-primary/80 to-primary" },
    activite: { label: "📅 Activité", variant: "secondary" as const, icon: Activity, gradient: "from-warning/80 to-warning" },
    reunion: { label: "🧑‍💼 Réunion", variant: "outline" as const, icon: CalendarDays, gradient: "from-info/80 to-info" },
  };

  const filters = [
    { key: "all" as const, label: "Tout", count: feed.length },
    { key: "note" as const, label: "Notes", count: feed.filter((f) => f.type === "note").length },
    { key: "activite" as const, label: "Activités", count: feed.filter((f) => f.type === "activite").length },
    { key: "reunion" as const, label: "Réunions", count: feed.filter((f) => f.type === "reunion").length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero with animated gradient */}
      <div className="relative overflow-hidden">
        <div className="gradient-primary py-20 relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white/20 blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-20 h-40 w-40 rounded-full bg-white/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-20 right-1/3 h-24 w-24 rounded-full bg-white/10 blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
          </div>
          <div className="mx-auto max-w-5xl px-4 text-center relative z-10">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-white/30 blur-lg" />
                <img src={cuyLogo} alt="CUY" className="relative h-24 w-24 rounded-2xl bg-white/90 p-2 shadow-xl" />
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm text-white/90 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Plateforme officielle
            </div>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-5xl tracking-tight">
              Communication Interne
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/80 leading-relaxed">
              Fil d'actualité officiel de la Communauté Urbaine de Yaoundé — Restez informé des notes de service, activités et réunions.
            </p>
            <div className="mt-8">
              <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm" onClick={() => navigate("/dashboard")}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Retour au tableau de bord
              </Button>
            </div>
          </div>
        </div>
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
            { label: "Notes de service", count: initialNotes.length, icon: Megaphone, color: "text-primary", bg: "bg-primary/10", desc: "Publications officielles" },
            { label: "Activités", count: initialActivites.length, icon: Activity, color: "text-warning", bg: "bg-warning/10", desc: "Événements programmés" },
            { label: "Réunions", count: initialReunions.length, icon: CalendarDays, color: "text-info", bg: "bg-info/10", desc: "Sessions planifiées" },
          ].map((s) => (
            <div key={s.label} className="group flex items-center gap-4 rounded-xl border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${s.bg} transition-transform group-hover:scale-110`}>
                <s.icon className={`h-7 w-7 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{s.count}</p>
                <p className="text-sm font-medium text-card-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mx-auto max-w-5xl px-4 pt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                filter === f.key ? "bg-white/20" : "bg-background"
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Fil d'actualité</h2>
          <span className="text-sm text-muted-foreground">({filtered.length} publications)</span>
        </div>
        <div className="space-y-4">
          {filtered.map((post, i) => {
            const badge = typeBadge[post.type];
            return (
              <article
                key={post.id}
                className="group rounded-2xl border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${badge.gradient} opacity-20 blur-sm`} />
                    <img src={cuyLogo} alt="CUY" className="relative h-14 w-14 rounded-xl bg-muted p-2 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant={badge.variant} className="text-xs">{badge.label}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.date}
                      </div>
                    </div>
                    <h3 className="mb-1.5 text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {post.titre}
                    </h3>
                    <p className="mb-2 text-xs font-medium text-primary/80">{post.auteur}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{post.contenu}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card py-10 mt-8">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={cuyLogo} alt="CUY" className="h-10 w-10 object-contain" />
            <div className="text-left">
              <span className="font-bold text-card-foreground text-lg">UrbaLink</span>
              <p className="text-xs text-muted-foreground">Plateforme de communication</p>
            </div>
          </div>
          <div className="h-px w-24 mx-auto bg-border mb-4" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Communauté Urbaine de Yaoundé — Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CommunicationModule;
