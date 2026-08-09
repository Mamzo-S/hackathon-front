import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  InscriptionRequete,
  MessageReponse,
  StatutResultats,
  Utilisateur,
} from '../models/utilisateur.model';
import { Equipe } from '../models/equipe.model';
import { Projet } from '../models/projet.model';
import { Evaluation } from '../models/evaluation.model';

/*
 *  Espace d'administration : tous les appels sont sous /api/admin,
 *  reserve au ROLE_ADMIN par WebSecurityConfig cote backend.
 *
 *  Point 4.3 du cahier de charge : gerer les utilisateurs, les equipes,
 *  les projets, et publier les resultats.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private url = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  /* ------------------------- Utilisateurs ------------------------- */

  // GET /api/admin/users
  getUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.url}/users`);
  }

  // POST /api/admin/users — creer un compte JURY, ADMIN ou PARTICIPANT
  creerUtilisateur(donnees: InscriptionRequete): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.url}/users`, donnees);
  }

  // DELETE /api/admin/users/{id}
  supprimerUtilisateur(id: number): Observable<MessageReponse> {
    return this.http.delete<MessageReponse>(`${this.url}/users/${id}`);
  }

  /* ---------------------------- Equipes ---------------------------- */

  getEquipes(): Observable<Equipe[]> {
    return this.http.get<Equipe[]>(`${this.url}/teams`);
  }

  supprimerEquipe(id: number): Observable<MessageReponse> {
    return this.http.delete<MessageReponse>(`${this.url}/teams/${id}`);
  }

  /* ---------------------------- Projets ---------------------------- */

  getProjets(): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.url}/projects`);
  }

  supprimerProjet(id: number): Observable<MessageReponse> {
    return this.http.delete<MessageReponse>(`${this.url}/projects/${id}`);
  }

  /* -------------------------- Evaluations -------------------------- */

  getEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.url}/evaluations`);
  }

  /* ------------------- Publication des resultats ------------------- */

  // GET /api/admin/results
  getStatutResultats(): Observable<StatutResultats> {
    return this.http.get<StatutResultats>(`${this.url}/results`);
  }

  // POST /api/admin/results/publish
  publierResultats(): Observable<StatutResultats> {
    return this.http.post<StatutResultats>(`${this.url}/results/publish`, {});
  }

  // POST /api/admin/results/unpublish
  masquerResultats(): Observable<StatutResultats> {
    return this.http.post<StatutResultats>(`${this.url}/results/unpublish`, {});
  }
}
