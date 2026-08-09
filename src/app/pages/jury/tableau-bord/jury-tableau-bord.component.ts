import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EvaluationService } from '../../../services/evaluation.service';
import { AuthService } from '../../../services/auth.service';

/*
 *  Accueil de l'espace JURY.
 *  Les compteurs viennent des ressources rxResource deja chargees par le
 *  service : projets a evaluer d'un cote, notes deja saisies de l'autre.
 */
@Component({
  selector: 'app-jury-tableau-bord',
  imports: [RouterLink],
  templateUrl: './jury-tableau-bord.component.html',
  styleUrl: './jury-tableau-bord.component.css',
})
export class JuryTableauBordComponent {
  constructor(
    public evaluationService: EvaluationService,
    public authService: AuthService,
  ) {}

  get nombreProjets(): number {
    return this.evaluationService.projetsAEvaluer.value().length;
  }

  get nombreNotes(): number {
    return this.evaluationService.mesEvaluations.value().length;
  }

  get nombreRestants(): number {
    const notes = this.evaluationService.mesEvaluations.value().map((e) => e.projectId);
    return this.evaluationService.projetsAEvaluer
      .value()
      .filter((p) => !notes.includes(p.id)).length;
  }

  /** Moyenne des notes que ce jury a attribuees */
  get moyenneDonnee(): number {
    const notes = this.evaluationService.mesEvaluations.value();
    if (notes.length === 0) {
      return 0;
    }
    const total = notes.reduce((somme, e) => somme + e.score, 0);
    return Math.round((total / notes.length) * 100) / 100;
  }
}
