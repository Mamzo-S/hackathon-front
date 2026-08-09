import { Utilisateur } from './utilisateur.model';

/** Corps envoye a POST /api/jury/evaluations */
export interface EvaluationRequete {
  projectId: number;
  noteInnovation: number;
  noteTechnique: number;
  notePresentation: number;
  comment: string | null;
}

/** Une evaluation renvoyee par l'API */
export interface Evaluation {
  id: number;
  noteInnovation: number;
  noteTechnique: number;
  notePresentation: number;
  score: number;
  comment: string | null;
  projectId: number;
  projectTitle: string;
  jury: Utilisateur;
  dateEvaluation: string;
}

/** Une ligne du classement : GET /api/leaderboard */
export interface LigneClassement {
  rang: number;
  teamId: number | null;
  teamName: string;
  projectTitle: string;
  scoreMoyen: number;
  nombreEvaluations: number;
}
