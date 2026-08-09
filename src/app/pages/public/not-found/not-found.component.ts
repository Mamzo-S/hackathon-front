import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/*
 *  Module 3 - section 7.2 : la route wildcard '**' pointe vers ce composant
 */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="hk-card hk-empty" style="padding: 4rem 1.5rem">
      <i class="bi bi-compass"></i>
      <h2 class="display-5 fw-bold mb-2" style="color: var(--hk-text)">404</h2>
      <p class="mb-4">La page demandee n'existe pas ou a ete deplacee.</p>
      <a routerLink="/dashboard" class="btn-hk">
        <i class="bi bi-house-door me-1"></i> Retour au tableau de bord
      </a>
    </div>
  `,
})
export class NotFoundComponent {}
