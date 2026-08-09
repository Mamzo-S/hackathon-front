import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleName } from '../models/utilisateur.model';

/*
 *  Module 3 - section 8.1 : proteger les routes
 *  Module 3 - section 8.2 : sauvegarder l'URL demandee pour y revenir apres login
 *
 *  Remarque : le cours presente le guard sous forme de CLASSE
 *  (AuthGuard implements CanActivate). Depuis Angular 15, cette forme est
 *  depreciee et remplacee par les guards FONCTIONNELS, qui recuperent leurs
 *  dependances avec inject() au lieu du constructeur. Le projet etant en
 *  Angular 21, on utilise la forme fonctionnelle. La logique est identique :
 *  retourner true pour autoriser, ou un UrlTree pour rediriger.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estConnecte()) {
    return true; // Acces autorise
  }

  // Acces refuse : rediriger vers /login en memorisant la page demandee
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

/*
 *  Guard de role. Les roles autorises sont declares dans la route :
 *
 *    { path: 'evaluation', component: EvaluationComponent,
 *      canActivate: [authGuard, roleGuard],
 *      data: { roles: ['ROLE_JURY', 'ROLE_ADMIN'] } }
 */
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const rolesAutorises = (route.data['roles'] ?? []) as RoleName[];

  if (rolesAutorises.length === 0 || authService.aUnDesRoles(rolesAutorises)) {
    return true;
  }

  // Role insuffisant : on renvoie l'utilisateur vers SON espace
  return router.parseUrl(authService.accueilSelonRole());
};

/*
 *  Empeche un utilisateur deja connecte d'ouvrir /login ou /register
 */
export const inviteGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.estConnecte() ? router.parseUrl(authService.accueilSelonRole()) : true;
};
