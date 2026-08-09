import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { EquipeService } from '../../../services/equipe.service';
import { ProjetService } from '../../../services/projet.service';
import { ClassementService } from '../../../services/classement.service';
import { ErreurService } from '../../../services/erreur.service';
import { Equipe } from '../../../models/equipe.model';
import { Projet } from '../../../models/projet.model';
import { LigneClassement } from '../../../models/evaluation.model';

/*
 *  Module 2 - section 5.4 : on s'abonne dans ngOnInit, jamais dans le constructeur.
 *  Le constructeur ne sert qu'a declarer les injections.
 */
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  monEquipe: Equipe | null = null;
  monProjet: Projet | null = null;
  premier: LigneClassement | null = null;

  /*
   *  Le classement est refuse (403) tant que l'administrateur n'a pas publie
   *  les resultats. Ce n'est pas une erreur : on l'affiche comme une attente.
   */
  classementNonPublie = false;

  chargement = true;
  erreur = '';

  constructor(
    public authService: AuthService,
    private equipeService: EquipeService,
    private projetService: ProjetService,
    private classementService: ClassementService,
    private erreurService: ErreurService,
  ) {}

  ngOnInit(): void {
    this.chargerMonEquipe();
    this.chargerMonProjet();
    this.chargerClassement();
  }

  private chargerMonEquipe(): void {
    this.equipeService.getMonEquipe().subscribe({
      next: (equipe) => {
        this.monEquipe = equipe;
        this.chargement = false;
      },
      // 404 = l'utilisateur n'appartient a aucune equipe, ce n'est pas une erreur
      error: () => {
        this.monEquipe = null;
        this.chargement = false;
      },
    });
  }

  private chargerMonProjet(): void {
    this.projetService.getMonProjet().subscribe({
      next: (projet) => (this.monProjet = projet),
      error: () => (this.monProjet = null),
    });
  }

  private chargerClassement(): void {
    this.classementService.getClassement().subscribe({
      next: (lignes) => {
        this.premier = lignes.length > 0 ? lignes[0] : null;
        this.classementNonPublie = false;
      },
      error: (err) => {
        if (err instanceof HttpErrorResponse && err.status === 403) {
          this.classementNonPublie = true;
        } else {
          this.erreur = this.erreurService.extraire(err);
        }
      },
    });
  }
}
