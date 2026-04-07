// Shared data store for cross-module state

export interface Ressource {
  id: number;
  nom: string;
  type: "Salle" | "Matériel";
  batiment: string;
  capacite: number;
  etat: "Disponible" | "Occupée" | "Maintenance";
  statut: "Actif" | "Inactif";
}

export interface Reunion {
  id: number;
  titre: string;
  date: string; // YYYY-MM-DD
  heureDebut: string; // HH:mm
  heureFin: string; // HH:mm
  salle: string;
  materiel: string[];
  organisateur: string;
  participants: string;
  statut: "À venir" | "Terminée" | "Annulée";
  compteRendu?: string; // filename
}

export interface Activite {
  id: number;
  titre: string;
  date: string;
  lieu: string;
  description: string;
  statut: "À venir" | "Terminée" | "Annulée";
  activeStatus: "Actif" | "Inactif";
}

export interface NoteService {
  id: number;
  titre: string;
  auteur: string;
  date: string;
  contenu: string;
  activeStatus: "Actif" | "Inactif";
}

export interface AgentPresence {
  id: number;
  nom: string;
  service: string;
  statut: "Présent" | "Absent" | "Réunion" | "Déplacement";
  dateAbsence?: string;
  heureDebut?: string;
  heureFin?: string;
  motif?: string;
}

// Initial data
export const initialRessources: Ressource[] = [
  { id: 1, nom: "Salle du Conseil", type: "Salle", batiment: "Bâtiment A", capacite: 50, etat: "Disponible", statut: "Actif" },
  { id: 2, nom: "Salle B", type: "Salle", batiment: "Bâtiment A", capacite: 20, etat: "Occupée", statut: "Actif" },
  { id: 3, nom: "Salle C", type: "Salle", batiment: "Bâtiment B", capacite: 15, etat: "Disponible", statut: "Actif" },
  { id: 4, nom: "Projecteur HP", type: "Matériel", batiment: "Stock", capacite: 0, etat: "Disponible", statut: "Actif" },
  { id: 5, nom: "Salle VIP", type: "Salle", batiment: "Bâtiment A", capacite: 30, etat: "Maintenance", statut: "Actif" },
  { id: 6, nom: "Vidéoprojecteur Epson", type: "Matériel", batiment: "Stock", capacite: 0, etat: "Disponible", statut: "Actif" },
  { id: 7, nom: "Micro sans fil", type: "Matériel", batiment: "Stock", capacite: 0, etat: "Occupée", statut: "Actif" },
];

export const initialReunions: Reunion[] = [
  { id: 1, titre: "Coordination mensuelle", date: "2026-04-07", heureDebut: "09:00", heureFin: "11:00", salle: "Salle du Conseil", materiel: ["Projecteur HP"], organisateur: "Secrétariat Général", participants: "Tous les chefs de service", statut: "À venir" },
  { id: 2, titre: "Comité technique voirie", date: "2026-04-10", heureDebut: "14:00", heureFin: "16:00", salle: "Salle B", materiel: [], organisateur: "Direction Voirie", participants: "Équipe technique", statut: "À venir" },
  { id: 3, titre: "Réunion budget Q2", date: "2026-04-02", heureDebut: "10:00", heureFin: "12:00", salle: "Salle du Conseil", materiel: ["Vidéoprojecteur Epson"], organisateur: "Direction Financière", participants: "Directeurs", statut: "Terminée" },
  { id: 4, titre: "Point sécurité", date: "2026-03-28", heureDebut: "11:00", heureFin: "12:30", salle: "Salle C", materiel: [], organisateur: "Service Sécurité", participants: "Agents terrain", statut: "Terminée" },
];

export const initialActivites: Activite[] = [
  { id: 1, titre: "Journée de l'arbre", date: "2026-04-12", lieu: "Lac Municipal", description: "Une journée de reboisement au bord du Lac Municipal. Tous les agents sont invités.", statut: "À venir", activeStatus: "Actif" },
  { id: 2, titre: "Formation sécurité incendie", date: "2026-04-08", lieu: "Salle du Conseil", description: "Formation obligatoire sur les procédures de sécurité incendie.", statut: "À venir", activeStatus: "Actif" },
  { id: 3, titre: "Nettoyage quartier Melen", date: "2026-03-25", lieu: "Melen", description: "Opération de salubrité dans le quartier Melen.", statut: "Terminée", activeStatus: "Actif" },
  { id: 4, titre: "Cérémonie de fin d'année", date: "2025-12-20", lieu: "Hôtel de Ville", description: "Cérémonie officielle de clôture de l'année.", statut: "Terminée", activeStatus: "Actif" },
];

export const initialNotes: NoteService[] = [
  { id: 1, titre: "Réorganisation des services techniques", auteur: "Direction Générale", date: "2026-04-05", contenu: "Suite à la délibération du conseil, les services techniques seront réorganisés à compter du 15 avril 2026.", activeStatus: "Actif" },
  { id: 2, titre: "Mise à jour du règlement intérieur", auteur: "Direction des RH", date: "2026-03-28", contenu: "Le nouveau règlement intérieur entre en vigueur le 1er avril 2026.", activeStatus: "Actif" },
  { id: 3, titre: "Horaires d'été", auteur: "Secrétariat Général", date: "2026-03-20", contenu: "Les horaires d'été entrent en vigueur le 1er mai 2026. Début à 7h30, fin à 15h30.", activeStatus: "Actif" },
];

export const initialAgents: AgentPresence[] = [
  { id: 1, nom: "Jean Nkoulou", service: "Urbanisme", statut: "Présent" },
  { id: 2, nom: "Marie Eyinga", service: "Administration", statut: "Réunion", heureDebut: "09:00", heureFin: "11:00" },
  { id: 3, nom: "Paul Mbarga", service: "Voirie", statut: "Absent", dateAbsence: "2026-04-07", heureDebut: "08:00", heureFin: "17:00", motif: "Congé maladie" },
  { id: 4, nom: "Claire Atangana", service: "Communication", statut: "Présent" },
  { id: 5, nom: "David Onana", service: "Finances", statut: "Déplacement", dateAbsence: "2026-04-07", heureDebut: "10:00", heureFin: "16:00", motif: "Mission terrain" },
  { id: 6, nom: "Suzanne Fouda", service: "Urbanisme", statut: "Présent" },
];

// Utility: check if a resource is available for a given time slot
export function isResourceAvailable(
  resourceName: string,
  date: string,
  heureDebut: string,
  heureFin: string,
  reunions: Reunion[],
  excludeReunionId?: number
): boolean {
  const start = timeToMinutes(heureDebut);
  const end = timeToMinutes(heureFin);

  const conflicting = reunions.filter(
    (r) =>
      r.date === date &&
      r.statut !== "Annulée" &&
      (r.salle === resourceName || r.materiel.includes(resourceName)) &&
      (excludeReunionId === undefined || r.id !== excludeReunionId)
  );

  for (const r of conflicting) {
    const rStart = timeToMinutes(r.heureDebut);
    const rEnd = timeToMinutes(r.heureFin);
    if (start < rEnd && end > rStart) {
      return false; // overlap
    }
  }
  return true;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
