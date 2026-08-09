import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  InscriptionRequete,
  LoginReponse,
  LoginRequete,
  RoleName,
  Utilisateur,
} from '../models/utilisateur.model';

/*
 *  Module 5 - section 11.3 : le service d'authentification
 *
 *  Responsabilites :
 *   - appeler POST /api/auth/login et stocker le token dans localStorage
 *   - dire si l'utilisateur est connecte (utilise par AuthGuard)
 *   - fournir le token (utilise par AuthInterceptor)
 *
 *  Module 5 - section 13.1 : un BehaviorSubject partage l'etat de connexion
 *  entre des composants non relies (ici : la navbar et les pages).
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY = 'user_data';

  /*
   *  BehaviorSubject : garde la derniere valeur emise et la donne
   *  immediatement a tout nouvel abonne. La navbar s'y abonne avec
   *  le pipe async (Module 5 - section 13.2).
   */
  private utilisateurSubject = new BehaviorSubject<LoginReponse | null>(this.lireSession());
  public utilisateur$: Observable<LoginReponse | null> = this.utilisateurSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // --- Connexion ---
  login(username: string, motDePasse: string): Observable<LoginReponse> {
    const corps: LoginRequete = { username, password: motDePasse };

    return this.http.post<LoginReponse>(`${environment.apiUrl}/auth/login`, corps).pipe(
      // tap : sauvegarder le token apres connexion reussie
      tap((reponse) => {
        localStorage.setItem(this.TOKEN_KEY, reponse.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(reponse));
        this.utilisateurSubject.next(reponse);
      }),
    );
  }

  // --- Inscription ---
  // Le backend force ROLE_PARTICIPANT : les comptes jury sont crees par l'admin
  inscription(donnees: InscriptionRequete): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${environment.apiUrl}/auth/register`, donnees);
  }

  // --- Deconnexion ---
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.utilisateurSubject.next(null);
    this.router.navigate(['/login']);
  }

  // --- Verifications ---
  estConnecte(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUtilisateur(): LoginReponse | null {
    return this.utilisateurSubject.value;
  }

  getUsername(): string | null {
    return this.getUtilisateur()?.username ?? null;
  }

  getRoles(): RoleName[] {
    return this.getUtilisateur()?.roles ?? [];
  }

  // --- Roles (utilise par RoleGuard et par les templates) ---
  aLeRole(role: RoleName): boolean {
    return this.getRoles().includes(role);
  }

  aUnDesRoles(roles: RoleName[]): boolean {
    return roles.some((r) => this.aLeRole(r));
  }

  estParticipant(): boolean {
    return this.aLeRole('ROLE_PARTICIPANT');
  }

  estJury(): boolean {
    return this.aLeRole('ROLE_JURY');
  }

  estAdmin(): boolean {
    return this.aLeRole('ROLE_ADMIN');
  }

  /*
   *  Page d'accueil de l'utilisateur, selon son role.
   *  Utilisee apres la connexion et par la navigation : chaque role dispose
   *  de son propre espace, avec ses pages et son menu.
   */
  accueilSelonRole(): string {
    if (this.estAdmin()) {
      return '/admin';
    }
    if (this.estJury()) {
      return '/jury';
    }
    if (this.estParticipant()) {
      return '/participant';
    }
    return '/classement';
  }

  // --- Profil (requete authentifiee) : GET /api/auth/me ---
  getMonProfil(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${environment.apiUrl}/auth/me`);
  }

  /** Relit la session depuis localStorage au demarrage de l'application */
  private lireSession(): LoginReponse | null {
    const donnees = localStorage.getItem(this.USER_KEY);
    if (!donnees) {
      return null;
    }
    try {
      return JSON.parse(donnees) as LoginReponse;
    } catch {
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }
}
