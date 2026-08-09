import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { ErreurService } from '../../../services/erreur.service';
import { Equipe } from '../../../models/equipe.model';
import { AvatarComponent } from '../../../partages/avatar/avatar.component';

/** Espace ADMINISTRATEUR : consultation et suppression des equipes. */
@Component({
  selector: 'app-admin-equipes',
  imports: [AvatarComponent],
  templateUrl: './admin-equipes.component.html',
})
export class AdminEquipesComponent implements OnInit {
  equipes: Equipe[] = [];
  chargement = true;
  enCours = false;
  erreur = '';
  succes = '';

  constructor(
    private adminService: AdminService,
    private erreurService: ErreurService,
  ) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement = true;
    this.adminService.getEquipes().subscribe({
      next: (donnees) => {
        this.equipes = donnees;
        this.chargement = false;
      },
      error: (err) => this.echouer(err),
    });
  }

  onSupprimer(equipe: Equipe): void {
    if (!confirm(`Supprimer l'equipe ${equipe.name} et retirer tous ses membres ?`)) {
      return;
    }
    this.enCours = true;
    this.erreur = '';
    this.succes = '';

    this.adminService.supprimerEquipe(equipe.id).subscribe({
      next: (reponse) => {
        this.succes = reponse.message;
        this.enCours = false;
        this.charger();
      },
      error: (err) => this.echouer(err),
    });
  }

  private echouer(err: unknown): void {
    this.enCours = false;
    this.chargement = false;
    this.erreur = this.erreurService.extraire(err);
  }
}
