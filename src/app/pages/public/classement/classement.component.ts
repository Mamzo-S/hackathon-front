import { Component, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ClassementService } from '../../../services/classement.service';
import { ErreurService } from '../../../services/erreur.service';
import { LigneClassement } from '../../../models/evaluation.model';

/*
 *  Page publique : GET /api/leaderboard
 *
 *  Ce composant utilise la version RxResource du service (exigence du TP1).
 *  A comparer avec DashboardComponent, qui appelle le meme endpoint avec la
 *  methode du cours : getClassement().subscribe().
 *
 *  Ici il n'y a ni variable "chargement", ni variable "erreur", ni subscribe :
 *  rxResource fournit les trois via des signals lus directement dans le template.
 */
@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrl: './classement.component.css',
})
export class ClassementComponent {
  constructor(
    public classementService: ClassementService,
    public erreurService: ErreurService,
  ) {}

  /*
   *  Les trois premieres equipes, affichees en podium.
   *  computed() recalcule automatiquement quand la ressource change.
   */
  readonly podium = computed<LigneClassement[]>(() =>
    this.classementService.classement.value().slice(0, 3),
  );

  /*
   *  Vrai quand l'API refuse le classement parce que l'administrateur ne l'a
   *  pas encore publie (point 4.3 du cahier de charge). On l'affiche comme un
   *  message d'attente et non comme une erreur.
   */
  readonly nonPublie = computed(() => {
    const erreur = this.classementService.classement.error();
    return erreur instanceof HttpErrorResponse && erreur.status === 403;
  });

  /** Classe CSS du badge de rang dans le tableau */
  couleurRang(rang: number): string {
    if (rang === 1) return 'rang-or';
    if (rang === 2) return 'rang-argent';
    if (rang === 3) return 'rang-bronze';
    return 'rang-autre';
  }
}
