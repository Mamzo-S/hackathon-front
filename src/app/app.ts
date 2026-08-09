import { Component, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';

/** Un lien du menu lateral */
export interface LienMenu {
  chemin: string;
  libelle: string;
  icone: string;
}

/*
 *  Composant racine : mise en page generale de l'application.
 *
 *  Le menu lateral est construit DYNAMIQUEMENT a partir du role de
 *  l'utilisateur connecte : chaque role dispose de son propre espace
 *  (/participant, /jury, /admin) avec ses propres pages.
 *
 *  Module 3 - sections 7.3 et 7.4 : router-outlet, routerLink, routerLinkActive
 *  Module 5 - section 13.2 : la topbar s'abonne a utilisateur$ avec le pipe async
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /** Vrai sur /login et /register : on masque la barre laterale */
  readonly pagePleinEcran = signal(false);

  /** Titre affiche dans la barre superieure */
  readonly titrePage = signal('');

  /** Barre laterale ouverte sur mobile */
  readonly menuOuvert = signal(false);

  /* ---------------- Les trois menus, un par espace ---------------- */

  private readonly menuParticipant: LienMenu[] = [
    { chemin: '/participant/tableau-bord', libelle: 'Tableau de bord', icone: 'bi-grid-1x2-fill' },
    { chemin: '/participant/equipe', libelle: 'Mon equipe', icone: 'bi-people-fill' },
    { chemin: '/participant/projet', libelle: 'Notre projet', icone: 'bi-rocket-takeoff-fill' },
    { chemin: '/classement', libelle: 'Classement', icone: 'bi-trophy-fill' },
  ];

  private readonly menuJury: LienMenu[] = [
    { chemin: '/jury/tableau-bord', libelle: 'Tableau de bord', icone: 'bi-grid-1x2-fill' },
    { chemin: '/jury/notation', libelle: 'Projets a evaluer', icone: 'bi-star-fill' },
    { chemin: '/jury/evaluations', libelle: 'Mes evaluations', icone: 'bi-list-check' },
    { chemin: '/classement', libelle: 'Classement', icone: 'bi-trophy-fill' },
  ];

  private readonly menuAdmin: LienMenu[] = [
    { chemin: '/admin/tableau-bord', libelle: 'Tableau de bord', icone: 'bi-grid-1x2-fill' },
    { chemin: '/admin/utilisateurs', libelle: 'Utilisateurs', icone: 'bi-person-lines-fill' },
    { chemin: '/admin/equipes', libelle: 'Equipes', icone: 'bi-people-fill' },
    { chemin: '/admin/projets', libelle: 'Projets', icone: 'bi-rocket-takeoff-fill' },
    { chemin: '/admin/evaluations', libelle: 'Evaluations', icone: 'bi-clipboard-check-fill' },
    { chemin: '/classement', libelle: 'Classement', icone: 'bi-trophy-fill' },
  ];

  private readonly menuVisiteur: LienMenu[] = [
    { chemin: '/classement', libelle: 'Classement', icone: 'bi-trophy-fill' },
  ];

  constructor(public authService: AuthService, private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = e.urlAfterRedirects.split('?')[0];
        this.pagePleinEcran.set(url === '/login' || url === '/register');
        this.titrePage.set(this.libelleDe(url));
        this.menuOuvert.set(false);
      });
  }

  /** Le menu correspondant au role de l'utilisateur connecte */
  get menu(): LienMenu[] {
    if (!this.authService.estConnecte()) {
      return this.menuVisiteur;
    }
    if (this.authService.estAdmin()) {
      return this.menuAdmin;
    }
    if (this.authService.estJury()) {
      return this.menuJury;
    }
    return this.menuParticipant;
  }

  /** Nom de l'espace, affiche au-dessus du menu */
  get nomEspace(): string {
    if (!this.authService.estConnecte()) {
      return 'Menu';
    }
    if (this.authService.estAdmin()) {
      return 'Espace administrateur';
    }
    if (this.authService.estJury()) {
      return 'Espace jury';
    }
    return 'Espace participant';
  }

  basculerMenu(): void {
    this.menuOuvert.set(!this.menuOuvert());
  }

  /** Initiales affichees dans la pastille */
  get initiales(): string {
    return (this.authService.getUsername() ?? '?').substring(0, 2).toUpperCase();
  }

  /** Libelle lisible du role principal */
  get libelleRole(): string {
    if (this.authService.estAdmin()) return 'Administrateur';
    if (this.authService.estJury()) return 'Membre du jury';
    if (this.authService.estParticipant()) return 'Participant';
    return 'Utilisateur';
  }

  /** Titre de la page courante, deduit du menu */
  private libelleDe(url: string): string {
    const lien = [...this.menuParticipant, ...this.menuJury, ...this.menuAdmin].find(
      (l) => l.chemin === url,
    );
    return lien ? lien.libelle : 'Hackathon';
  }
}
