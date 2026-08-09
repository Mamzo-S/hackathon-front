import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Projet, ProjetRequete } from '../models/projet.model';

@Injectable({
  providedIn: 'root',
})
export class ProjetService {
  private url = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  // GET /api/projects
  getTous(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.url);
  }

  // GET /api/projects/{id}
  getParId(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${this.url}/${id}`);
  }

  // GET /api/projects/me — le projet de mon equipe
  getMonProjet(): Observable<Projet> {
    return this.http.get<Projet>(`${this.url}/me`);
  }

  // POST /api/projects — soumettre un projet
  soumettre(projet: ProjetRequete): Observable<Projet> {
    return this.http.post<Projet>(this.url, projet);
  }

  // PUT /api/projects/{id} — modifier avant la deadline
  modifier(id: number, projet: ProjetRequete): Observable<Projet> {
    return this.http.put<Projet>(`${this.url}/${id}`, projet);
  }
}
