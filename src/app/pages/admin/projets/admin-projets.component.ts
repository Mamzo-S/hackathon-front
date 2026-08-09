import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { ErreurService } from '../../../services/erreur.service';
import { Projet } from '../../../models/projet.model';

/** Espace ADMINISTRATEUR : consultation et suppression des projets. */
@Component({
  selector: 'app-admin-projets',
  templateUrl: './admin-projets.component.html',
})
export class AdminProjetsComponent implements OnInit {
  projets: Projet[] = [];
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
    this.adminService.getProjets().subscribe({
      next: (donnees) => {
        this.projets = donnees;
        this.chargement = false;
      },
      error: (err) => this.echouer(err),
    });
  }

  onSupprimer(projet: Projet): void {
    if (!confirm(`Supprimer le projet ${projet.title} ?`)) {
      return;
    }
    this.enCours = true;
    this.erreur = '';
    this.succes = '';

    this.adminService.supprimerProjet(projet.id).subscribe({
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
