import { Component } from '@angular/core';
import { DateFrPipe } from '../../../partages/pipes/date-fr.pipe';
import { RouterLink } from '@angular/router';
import { EvaluationService } from '../../../services/evaluation.service';
import { ErreurService } from '../../../services/erreur.service';

/*
 *  Espace JURY : la liste des notes deja attribuees par le jury connecte.
 *  Lecture par rxResource (GET /api/jury/evaluations).
 *
 *  La modification d'une note se fait depuis la page de notation :
 *  le backend refuse un second POST sur un projet deja note et impose
 *  un PUT explicite (voir EvaluationService cote serveur).
 */
@Component({
  selector: 'app-jury-evaluations',
  imports: [DateFrPipe, RouterLink],
  templateUrl: './jury-evaluations.component.html',
})
export class JuryEvaluationsComponent {
  constructor(
    public evaluationService: EvaluationService,
    public erreurService: ErreurService,
  ) {}

  get moyenne(): number {
    const notes = this.evaluationService.mesEvaluations.value();
    if (notes.length === 0) {
      return 0;
    }
    return Math.round((notes.reduce((s, e) => s + e.score, 0) / notes.length) * 100) / 100;
  }
}
