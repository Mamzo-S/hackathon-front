import { Routes } from '@angular/router';
import { authGuard, inviteGuard, roleGuard } from './guards/auth.guard';

/*
 *  Module 3 : configuration des routes
 *   - section 7.2 : redirection par defaut et route wildcard
 *   - section 8.1 : protection par guard (canActivate)
 *   - section 8.3 : lazy loading avec loadComponent
 *   - section 8.4 : routes imbriquees (children)
 *
 *  L'application propose TROIS ESPACES distincts, un par role :
 *
 *    /participant/**  reserve a ROLE_PARTICIPANT
 *    /jury/**         reserve a ROLE_JURY
 *    /admin/**        reserve a ROLE_ADMIN
 *
 *  Chaque espace a ses propres pages et sa propre navigation. Apres la
 *  connexion, l'utilisateur est redirige vers l'espace correspondant a son
 *  role (voir AuthService.accueilSelonRole).
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },

  /* ------------------------- Pages publiques ------------------------- */

  {
    path: 'login',
    title: 'Connexion',
    canActivate: [inviteGuard],
    loadComponent: () =>
      import('./pages/public/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    title: 'Inscription',
    canActivate: [inviteGuard],
    loadComponent: () =>
      import('./pages/public/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    // Classement : public cote backend une fois les resultats publies
    path: 'classement',
    title: 'Classement',
    loadComponent: () =>
      import('./pages/public/classement/classement.component').then((m) => m.ClassementComponent),
  },

  /* --------------------- ESPACE PARTICIPANT --------------------- */

  {
    path: 'participant',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_PARTICIPANT'] },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tableau-bord' },
      {
        path: 'tableau-bord',
        title: 'Tableau de bord',
        loadComponent: () =>
          import('./pages/participant/tableau-bord/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'equipe',
        title: 'Mon equipe',
        loadComponent: () =>
          import('./pages/participant/equipe/equipes.component').then((m) => m.EquipesComponent),
      },
      {
        path: 'projet',
        title: 'Notre projet',
        loadComponent: () =>
          import('./pages/participant/projet/projets.component').then((m) => m.ProjetsComponent),
      },
    ],
  },

  /* ------------------------- ESPACE JURY ------------------------- */

  {
    path: 'jury',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_JURY'] },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tableau-bord' },
      {
        path: 'tableau-bord',
        title: 'Espace jury',
        loadComponent: () =>
          import('./pages/jury/tableau-bord/jury-tableau-bord.component').then((m) => m.JuryTableauBordComponent),
      },
      {
        path: 'notation',
        title: 'Projets a evaluer',
        loadComponent: () =>
          import('./pages/jury/notation/evaluation.component').then((m) => m.EvaluationComponent),
      },
      {
        path: 'evaluations',
        title: 'Mes evaluations',
        loadComponent: () =>
          import('./pages/jury/evaluations/jury-evaluations.component').then((m) => m.JuryEvaluationsComponent),
      },
    ],
  },

  /* --------------------- ESPACE ADMINISTRATEUR --------------------- */

  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tableau-bord' },
      {
        path: 'tableau-bord',
        title: 'Espace administrateur',
        loadComponent: () =>
          import('./pages/admin/tableau-bord/admin-tableau-bord.component').then((m) => m.AdminTableauBordComponent),
      },
      {
        path: 'utilisateurs',
        title: 'Utilisateurs',
        loadComponent: () =>
          import('./pages/admin/utilisateurs/admin-utilisateurs.component').then((m) => m.AdminUtilisateursComponent),
      },
      {
        path: 'equipes',
        title: 'Equipes',
        loadComponent: () =>
          import('./pages/admin/equipes/admin-equipes.component').then((m) => m.AdminEquipesComponent),
      },
      {
        path: 'projets',
        title: 'Projets',
        loadComponent: () =>
          import('./pages/admin/projets/admin-projets.component').then((m) => m.AdminProjetsComponent),
      },
      {
        path: 'evaluations',
        title: 'Evaluations',
        loadComponent: () =>
          import('./pages/admin/evaluations/admin-evaluations.component').then((m) => m.AdminEvaluationsComponent),
      },
    ],
  },

  // Route wildcard : capture tout ce qui ne correspond a rien
  {
    path: '**',
    title: 'Page introuvable',
    loadComponent: () =>
      import('./pages/public/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
