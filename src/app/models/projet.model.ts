import { Membre } from './equipe.model';

export interface EquipeResume {
  id: number;
  name: string;
}

/*
 *  Un projet : GET /api/projects
 *
 *  scoreMoyen et nombreEvaluations valent null tant que l'administrateur n'a
 *  pas publie les resultats. Le jury et l'administration recoivent toujours
 *  les vraies valeurs.
 */
export interface Projet {
  id: number;
  title: string;
  description: string | null;
  githubLink: string | null;
  team: EquipeResume | null;
  membres: Membre[];
  scoreMoyen: number | null;
  nombreEvaluations: number | null;
}

/** Corps envoye a POST /api/projects et PUT /api/projects/{id} */
export interface ProjetRequete {
  title: string;
  description: string | null;
  githubLink: string | null;
}
