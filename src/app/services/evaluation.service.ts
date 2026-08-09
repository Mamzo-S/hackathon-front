import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Evaluation, EvaluationRequete } from '../models/evaluation.model';
import { Projet } from '../models/projet.model';

/*
 *  Espace jury : GET /api/jury/projects et POST /api/jury/evaluations
 *  Ces endpoints sont reserves aux ROLE_JURY et ROLE_ADMIN cote backend.
 *
 *  Les deux LECTURES passent par rxResource (voir l'explication detaillee
 *  dans classement.service.ts). L'ECRITURE reste un Observable classique
 *  auquel le composant s'abonne avec subscribe(), comme dans le cours.
 */
@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private url = `${environment.apiUrl}/jury`;

  constructor(private http: HttpClient) {}

  /** RxResource — GET /api/jury/projects : les projets a evaluer */
  readonly projetsAEvaluer = rxResource({
    stream: () => this.http.get<Projet[]>(`${this.url}/projects`),
    defaultValue: [] as Projet[],
  });

  /** RxResource — GET /api/jury/evaluations : les notes deja saisies */
  readonly mesEvaluations = rxResource({
    stream: () => this.http.get<Evaluation[]>(`${this.url}/evaluations`),
    defaultValue: [] as Evaluation[],
  });

  /*
   *  POST /api/jury/evaluations — PREMIERE notation.
   *  Le backend refuse si ce jury a deja note le projet.
   */
  noter(evaluation: EvaluationRequete): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.url}/evaluations`, evaluation);
  }

  /*
   *  PUT /api/jury/evaluations/{id} — MODIFICATION d'une note existante.
   *  Reservee a son auteur.
   */
  modifier(idEvaluation: number, evaluation: EvaluationRequete): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.url}/evaluations/${idEvaluation}`, evaluation);
  }

  /** A appeler apres une notation pour rafraichir les deux listes */
  rafraichir(): void {
    this.projetsAEvaluer.reload();
    this.mesEvaluations.reload();
  }
}
