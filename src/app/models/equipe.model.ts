import { Utilisateur } from './utilisateur.model';

/** Un membre d'equipe : GET /api/teams/{id}/members */
export interface Membre {
  id: number;
  utilisateur: Utilisateur;
  createur: boolean;
  dateAdhesion: string;
}

/** Resume du projet, inclus dans une equipe */
export interface ProjetResume {
  id: number;
  title: string;
}

/** Une equipe : GET /api/teams */
export interface Equipe {
  id: number;
  name: string;
  description: string | null;
  createdBy: Utilisateur | null;
  dateCreation: string;
  nombreMembres: number;
  membres: Membre[];
  projet: ProjetResume | null;
}

/** Corps envoye a POST /api/teams */
export interface EquipeRequete {
  name: string;
  description: string | null;
}
