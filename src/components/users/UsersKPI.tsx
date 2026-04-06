import { Users, UserCheck, UserX } from "lucide-react";

interface Props {
  total: number;
  actif: number;
  inactif: number;
}

const UsersKPI = ({ total, actif, inactif }: Props) => {
  const cards = [
    { label: "Total utilisateurs", value: total, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Actifs", value: actif, icon: UserCheck, color: "text-success", bg: "bg-success/10" },
    { label: "Inactifs", value: inactif, icon: UserX, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
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
  );
};

export default UsersKPI;
