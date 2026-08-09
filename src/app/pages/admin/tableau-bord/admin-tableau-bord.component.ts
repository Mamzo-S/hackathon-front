import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { ErreurService } from '../../../services/erreur.service';
import { Utilisateur } from '../../../models/utilisateur.model';
import { Equipe } from '../../../models/equipe.model';
import { Projet } from '../../../models/projet.model';
import { Evaluation } from '../../../models/evaluation.model';

/*
 *  Accueil de l'espace ADMINISTRATEUR.
 *  Vue d'ensemble du hackathon et commande de publication des resultats
 *  (point 4.3 du cahier de charge).
 */
@Component({
  selector: 'app-admin-tableau-bord',
  imports: [RouterLink],
  templateUrl: './admin-tableau-bord.component.html',
  styleUrl: './admin-tableau-bord.component.css',
})
export class AdminTableauBordComponent implements OnInit {
  utilisateurs: Utilisateur[] = [];
  equipes: Equipe[] = [];
  projets: Projet[] = [];
  evaluations: Evaluation[] = [];

  resultatsPublies = false;

  chargement = true;
  enCours = false;
  erreur = '';
  succes = '';

  constructor(
    private adminService: AdminService,
    private erreurService: ErreurService,
  ) {}

  ngOnInit(): void {
    this.adminService.getUtilisateurs().subscribe({
      next: (d) => {
        this.utilisateurs = d;
        this.chargement = false;
      },
      error: (e) => this.echouer(e),
    });
    this.adminService.getEquipes().subscribe({
      next: (d) => (this.equipes = d),
      error: (e) => this.echouer(e),
    });
    this.adminService.getProjets().subscribe({
      next: (d) => (this.projets = d),
      error: (e) => this.echouer(e),
    });
    this.adminService.getEvaluations().subscribe({
      next: (d) => (this.evaluations = d),
      error: (e) => this.echouer(e),
    });
    this.adminService.getStatutResultats().subscribe({
      next: (s) => (this.resultatsPublies = s.publies),
      error: (e) => this.echouer(e),
    });
  }

  basculerPublication(): void {
    this.enCours = true;
    this.erreur = '';
    this.succes = '';

    const requete = this.resultatsPublies
      ? this.adminService.masquerResultats()
      : this.adminService.publierResultats();

    requete.subscribe({
      next: (statut) => {
        this.resultatsPublies = statut.publies;
        this.succes = statut.message;
        this.enCours = false;
      },
      error: (e) => this.echouer(e),
    });
  }

  get nombreParticipants(): number {
    return this.utilisateurs.filter((u) => u.roles.includes('ROLE_PARTICIPANT')).length;
  }

  get nombreJurys(): number {
    return this.utilisateurs.filter((u) => u.roles.includes('ROLE_JURY')).length;
  }

  /** Projets n'ayant recu aucune note */
  get projetsNonNotes(): number {
    const notes = this.evaluations.map((e) => e.projectId);
    return this.projets.filter((p) => !notes.includes(p.id)).length;
  }

  private echouer(err: unknown): void {
    this.enCours = false;
    this.chargement = false;
    this.erreur = this.erreurService.extraire(err);
  }
}
