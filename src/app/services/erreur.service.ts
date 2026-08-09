import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErreurApi } from '../models/utilisateur.model';

/*
 *  Module 5 - section 13.3 : gestion des erreurs et feedback utilisateur
 *
 *  Le backend Spring renvoie ses erreurs via GlobalExceptionHandler sous la
 *  forme { status, error, message, path }. Ce service extrait le message
 *  metier pour l'afficher tel quel a l'utilisateur.
 */
@Injectable({
  providedIn: 'root',
})
export class ErreurService {
  extraire(erreur: unknown): string {
    if (erreur instanceof HttpErrorResponse) {
      const corps = erreur.error as ErreurApi | string | null;

      if (corps && typeof corps === 'object' && corps.message) {
        return corps.message;
      }
      if (typeof corps === 'string' && corps.trim() !== '') {
        return corps;
      }

      switch (erreur.status) {
        case 0:
          return "Le serveur est injoignable. Verifiez que Tomcat est demarre et que l'URL de l'API est correcte.";
        case 401:
          return 'Identifiants invalides.';
        case 403:
          return "Vous n'avez pas les droits necessaires pour cette action.";
        case 404:
          return 'Ressource introuvable.';
        default:
          return `Erreur ${erreur.status} : ${erreur.statusText}`;
      }
    }
    return 'Une erreur inattendue est survenue.';
  }
}
