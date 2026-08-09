import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/*
 *  Module 5 - section 11.4 : l'intercepteur HTTP
 *
 *  Sans intercepteur, il faudrait ajouter le header Authorization dans CHAQUE
 *  requete. L'intercepteur le fait une seule fois pour toutes les requetes.
 *
 *  Forme fonctionnelle, comme dans le Module 6 :
 *    provideHttpClient(withInterceptors([authInterceptor]))
 *
 *  Pour verifier qu'il fonctionne : ouvrir l'onglet Network du navigateur et
 *  regarder l'en-tete "Authorization: Bearer ..." sur les requetes.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si un token existe, cloner la requete et ajouter le header
  const requete = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(requete).pipe(
    catchError((erreur: HttpErrorResponse) => {
      /*
       *  401 : le token est absent, invalide ou expire. On deconnecte
       *  l'utilisateur, ce qui le renvoie vers la page de connexion.
       */
      if (erreur.status === 401 && token) {
        authService.logout();
      }

      /*
       *  403 : volontairement PAS de redirection ici.
       *  L'acces a une page interdite est deja bloque par roleGuard ; un 403
       *  renvoye par l'API signifie plutot qu'une action precise est refusee
       *  (par exemple consulter le classement avant sa publication). Rediriger
       *  ferait disparaitre le message d'explication sans que l'utilisateur
       *  comprenne pourquoi. Chaque page affiche donc le message elle-meme.
       */

      return throwError(() => erreur);
    }),
  );
};
