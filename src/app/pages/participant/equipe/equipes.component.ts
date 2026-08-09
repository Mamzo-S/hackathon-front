import { Component, OnInit } from '@angular/core';
import { DateFrPipe } from '../../../partages/pipes/date-fr.pipe';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EquipeService } from '../../../services/equipe.service';
import { ErreurService } from '../../../services/erreur.service';
import { AvatarComponent } from '../../../partages/avatar/avatar.component';
import { Equipe, Membre } from '../../../models/equipe.model';

/*
 *  Module 5 - section 12.3 : composant liste avec operations CRUD
 *  Creer une equipe, la rejoindre, la quitter, voir ses membres.
 */
@Component({
  selector: 'app-equipes',
  imports: [ReactiveFormsModule, AvatarComponent, DateFrPipe],
  templateUrl: './equipes.component.html',
  styleUrl: './equipes.component.css',
})
export class EquipesComponent implements OnInit {
  equipes: Equipe[] = [];
  monEquipe: Equipe | null = null;

  /*
   *  Membres de MON equipe, charges par leur propre endpoint
   *  (GET /api/teams/{id}/members).
   */
  mesCoequipiers: Membre[] = [];

  equipeForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
  });

  chargement = true;
  enCours = false;
  erreur = '';
  succes = '';

  constructor(
    private fb: FormBuilder,
    private equipeService: EquipeService,
    private erreurService: ErreurService,
  ) {}

  get name() {
    return this.equipeForm.get('name');
  }

  ngOnInit(): void {
    this.chargerEquipes();
    this.chargerMonEquipe();
  }

  chargerEquipes(): void {
    this.chargement = true;
    this.equipeService.getToutes().subscribe({
      next: (equipes) => {
        this.equipes = equipes;
        this.chargement = false;
      },
      error: (err) => {
        this.erreur = this.erreurService.extraire(err);
        this.chargement = false;
      },
    });
  }

  chargerMonEquipe(): void {
    this.equipeService.getMonEquipe().subscribe({
      next: (equipe) => {
        this.monEquipe = equipe;
        this.chargerMembres(equipe.id);
      },
      error: () => {
        this.monEquipe = null;
        this.mesCoequipiers = [];
      },
    });
  }

  chargerMembres(idEquipe: number): void {
    this.equipeService.getMembres(idEquipe).subscribe({
      next: (membres) => (this.mesCoequipiers = membres),
      error: () => (this.mesCoequipiers = []),
    });
  }

  /** L'utilisateur connecte est-il membre de cette equipe ? */
  estMonEquipe(equipe: Equipe): boolean {
    return this.monEquipe !== null && this.monEquipe.id === equipe.id;
  }

  onCreer(): void {
    if (this.equipeForm.invalid) {
      this.equipeForm.markAllAsTouched();
      return;
    }

    this.demarrer();
    this.equipeService
      .creer({
        name: this.equipeForm.value.name!,
        description: this.equipeForm.value.description || null,
      })
      .subscribe({
        next: () => {
          this.succes = 'Equipe creee.';
          this.equipeForm.reset();
          this.terminer();
        },
        error: (err) => this.echouer(err),
      });
  }

  onRejoindre(equipe: Equipe): void {
    this.demarrer();
    this.equipeService.rejoindre(equipe.id).subscribe({
      next: () => {
        this.succes = `Vous avez rejoint l'equipe ${equipe.name}.`;
        this.terminer();
      },
      error: (err) => this.echouer(err),
    });
  }

  onQuitter(equipe: Equipe): void {
    this.demarrer();
    this.equipeService.quitter(equipe.id).subscribe({
      next: (reponse) => {
        this.succes = reponse.message;
        this.terminer();
      },
      error: (err) => this.echouer(err),
    });
  }

  // --- Petits helpers de feedback (Module 5 - section 13.3) ---

  private demarrer(): void {
    this.enCours = true;
    this.erreur = '';
    this.succes = '';
  }

  private terminer(): void {
    this.enCours = false;
    this.chargerEquipes();
    this.chargerMonEquipe();
  }

  private echouer(err: unknown): void {
    this.enCours = false;
    this.erreur = this.erreurService.extraire(err);
  }
}
