import { Component, OnInit } from '@angular/core';
import { DateFrPipe } from '../../../partages/pipes/date-fr.pipe';
import { AdminService } from '../../../services/admin.service';
import { ErreurService } from '../../../services/erreur.service';
import { Evaluation } from '../../../models/evaluation.model';

/** Espace ADMINISTRATEUR : toutes les notes attribuees par le jury. */
@Component({
  selector: 'app-admin-evaluations',
  imports: [DateFrPipe],
  templateUrl: './admin-evaluations.component.html',
})
export class AdminEvaluationsComponent implements OnInit {
  evaluations: Evaluation[] = [];
  chargement = true;
  erreur = '';

  constructor(
    private adminService: AdminService,
    private erreurService: ErreurService,
  ) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement = true;
    this.adminService.getEvaluations().subscribe({
      next: (donnees) => {
        this.evaluations = donnees;
        this.chargement = false;
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = this.erreurService.extraire(err);
      },
    });
  }

  get moyenneGenerale(): number {
    if (this.evaluations.length === 0) {
      return 0;
    }
    const total = this.evaluations.reduce((s, e) => s + e.score, 0);
    return Math.round((total / this.evaluations.length) * 100) / 100;
  }
}
