import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EvaluationService } from '../../../services/evaluation.service';
import { ErreurService } from '../../../services/erreur.service';
import { Projet } from '../../../models/projet.model';
import { Evaluation } from '../../../models/evaluation.model';
import { AvatarComponent } from '../../../partages/avatar/avatar.component';

/*
 *  Page reservee au jury : la route est protegee par roleGuard
 *  avec data: { roles: ['ROLE_JURY', 'ROLE_ADMIN'] }.
 *
 *  Criteres du cahier des charges (point 5.4) : Innovation, Technique,
 *  Presentation, chacun note sur 20. Le score final est leur moyenne,
 *  calculee cote serveur.
 *
 *  Les LECTURES viennent de rxResource, l'ECRITURE utilise subscribe()
 *  comme dans le cours.
 */
@Component({
  selector: 'app-evaluation',
  imports: [ReactiveFormsModule, AvatarComponent],
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.css',
})
export class EvaluationComponent {
  projetSelectionne: Projet | null = null;

  /*
   *  L'evaluation deja saisie par ce jury pour le projet selectionne.
   *  Si elle existe, le formulaire passe en mode MODIFICATION (PUT) ;
   *  sinon en mode PREMIERE NOTATION (POST).
   */
  evaluationEnCours: Evaluation | null = null;

  noteForm = this.fb.group({
    noteInnovation: [10, [Validators.required, Validators.min(0), Validators.max(20)]],
    noteTechnique: [10, [Validators.required, Validators.min(0), Validators.max(20)]],
    notePresentation: [10, [Validators.required, Validators.min(0), Validators.max(20)]],
    comment: [''],
  });

  enCours = false;
  erreur = '';
  succes = '';

  constructor(
    private fb: FormBuilder,
    public evaluationService: EvaluationService,
    public erreurService: ErreurService,
  ) {}

  /** Apercu du score : meme calcul que le serveur (moyenne des 3 criteres) */
  get apercuScore(): number {
    const v = this.noteForm.value;
    const total = (v.noteInnovation ?? 0) + (v.noteTechnique ?? 0) + (v.notePresentation ?? 0);
    return Math.round((total / 3) * 100) / 100;
  }

  /** La note deja donnee par ce jury pour ce projet, si elle existe */
  noteExistante(projet: Projet): Evaluation | undefined {
    return this.evaluationService.mesEvaluations.value().find((e) => e.projectId === projet.id);
  }

  onSelectionner(projet: Projet): void {
    this.projetSelectionne = projet;
    this.erreur = '';
    this.succes = '';

    const existante = this.noteExistante(projet) ?? null;
    this.evaluationEnCours = existante;
    this.noteForm.setValue({
      noteInnovation: existante?.noteInnovation ?? 10,
      noteTechnique: existante?.noteTechnique ?? 10,
      notePresentation: existante?.notePresentation ?? 10,
      comment: existante?.comment ?? '',
    });
  }

  onAnnuler(): void {
    this.projetSelectionne = null;
    this.evaluationEnCours = null;
  }

  /** Vrai si l'on modifie une note deja donnee */
  get modeModification(): boolean {
    return this.evaluationEnCours !== null;
  }

  onNoter(): void {
    if (!this.projetSelectionne || this.noteForm.invalid) {
      this.noteForm.markAllAsTouched();
      return;
    }

    this.enCours = true;
    this.erreur = '';
    this.succes = '';

    const v = this.noteForm.value;

    const corps = {
      projectId: this.projetSelectionne.id,
      noteInnovation: Number(v.noteInnovation),
      noteTechnique: Number(v.noteTechnique),
      notePresentation: Number(v.notePresentation),
      comment: v.comment?.trim() ? v.comment : null,
    };

    // POST pour une premiere note, PUT pour modifier la sienne
    const requete = this.evaluationEnCours
      ? this.evaluationService.modifier(this.evaluationEnCours.id, corps)
      : this.evaluationService.noter(corps);

    requete
      .subscribe({
        next: (evaluation) => {
          this.succes = this.modeModification
            ? `Note modifiee : ${evaluation.score} / 20`
            : `Note enregistree : ${evaluation.score} / 20`;
          this.enCours = false;
          this.projetSelectionne = null;
          this.evaluationEnCours = null;
          // rxResource : on relance les deux lectures
          this.evaluationService.rafraichir();
        },
        error: (err) => {
          this.enCours = false;
          this.erreur = this.erreurService.extraire(err);
        },
      });
  }
}
