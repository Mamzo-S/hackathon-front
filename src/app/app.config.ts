import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

/*
 *  Module 6 - section 15.3 : configuration d'une application standalone.
 *  Remplace app.module.ts : HttpClientModule devient provideHttpClient(),
 *  et l'enregistrement de l'intercepteur via HTTP_INTERCEPTORS devient
 *  withInterceptors([...]).
 *
 *  ---------------------------------------------------------------------
 *  provideZoneChangeDetection : pourquoi cette ligne est indispensable
 *  ---------------------------------------------------------------------
 *  Depuis Angular 20, "ng new" genere une application SANS Zone.js, en mode
 *  dit "zoneless" : Angular ne rafraichit alors l'affichage que lorsqu'un
 *  signal change.
 *
 *  Or nos composants suivent la methode du cours : ils modifient de simples
 *  proprietes de classe a l'interieur d'un subscribe()
 *  (this.chargement = false, this.equipes = ...). En mode zoneless, Angular
 *  ne detecte pas ces modifications et l'ecran reste fige sur l'indicateur
 *  de chargement.
 *
 *  On reactive donc Zone.js, qui surveille les operations asynchrones
 *  (requetes HTTP, evenements, minuteurs) et declenche le rafraichissement
 *  automatiquement. C'est le fonctionnement historique d'Angular, celui
 *  decrit dans le cours.
 *
 *  eventCoalescing regroupe les evenements rapproches en un seul cycle de
 *  detection, ce qui evite des rafraichissements inutiles.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
