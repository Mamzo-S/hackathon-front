import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Equipe, EquipeRequete, Membre } from '../models/equipe.model';
import { MessageReponse } from '../models/utilisateur.model';

/*
 *  Module 2 - section 6.1 : un service par ressource.
 *  Le composant NE FAIT PAS d'appel HTTP : il appelle ce service et
 *  s'abonne au resultat avec subscribe().
 */
@Injectable({
  providedIn: 'root',
})
export class EquipeService {
  private url = `${environment.apiUrl}/teams`;

  constructor(private http: HttpClient) {}

  // GET /api/teams — la liste, chaque equipe contenant deja ses membres
  getToutes(): Observable<Equipe[]> {
    return this.http.get<Equipe[]>(this.url);
  }

  // GET /api/teams/{id}
  getParId(id: number): Observable<Equipe> {
    return this.http.get<Equipe>(`${this.url}/${id}`);
  }

  // GET /api/teams/me — l'equipe de l'utilisateur connecte
  getMonEquipe(): Observable<Equipe> {
    return this.http.get<Equipe>(`${this.url}/me`);
  }

  // GET /api/teams/{id}/members
  getMembres(id: number): Observable<Membre[]> {
    return this.http.get<Membre[]>(`${this.url}/${id}/members`);
  }

  // POST /api/teams — creer une equipe
  creer(equipe: EquipeRequete): Observable<Equipe> {
    return this.http.post<Equipe>(this.url, equipe);
  }

  // POST /api/teams/{id}/join — rejoindre une equipe
  rejoindre(id: number): Observable<Equipe> {
    return this.http.post<Equipe>(`${this.url}/${id}/join`, {});
  }

  // DELETE /api/teams/{id}/leave — quitter une equipe
  quitter(id: number): Observable<MessageReponse> {
    return this.http.delete<MessageReponse>(`${this.url}/${id}/leave`);
  }
}
