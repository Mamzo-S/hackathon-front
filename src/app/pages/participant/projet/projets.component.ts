import { Component, OnInit } from '@angular/core';
import { DateFrPipe } from '../../../partages/pipes/date-fr.pipe';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjetService } from '../../../services/projet.service';
import { EquipeService } from '../../../services/equipe.service';
import { ErreurService } from '../../../services/erreur.service';
import { Projet } from '../../../models/projet.model';
import { Equipe, Membre } from '../../../models/equipe.model';
import { AvatarComponent } from '../../../partages/avatar/avatar.component';

/*
 *  Espace PARTICIPANT : le projet de SON equipe, et lui seul.
 *
 *  Point 6 du cahier de charge, "Acces controle : Participant => son equipe".
 *  Un participant n'a pas a consulter le detail des projets concurrents :
 *  la liste complete est reservee au jury et a l'administration.
 *
 *  Module 5 - section 12.4 : un seul formulaire sert a la creation ET a
 *  l'edition. Si l'equipe a deja un projet, le formulaire est pre-rempli et
 *  le bouton declenche un PUT au lieu d'un POST.
 */
@Component({
  selector: 'app-projets',
  imports: [ReactiveFormsModule, DateFrPipe, RouterLink, AvatarComponent],
  templateUrl: './projets.component.html',
  styleUrl: './projets.component.css',
})
export class ProjetsComponent implements OnInit {
  monProjet: Projet | null = null;
  monEquipe: Equipe | null = null;

  /*
   *  Les membres sont charges par leur propre endpoint
   *  (GET /api/teams/{id}/members) plutot que lus dans l'objet equipe :
   *  l'affichage ne depend ainsi d'aucun champ imbrique.
   */
  membres: Membre[] = [];

  projetForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    githubLink: [''],
  });

  chargement = true;
  enCours = false;
  erreur = '';
  succes = '';

  constructor(
    private fb: FormBuilder,
    private projetService: ProjetService,
    private equipeService: EquipeService,
    private erreurService: ErreurService,
  ) {}

  get title() {
    return this.projetForm.get('title');
  }

  get description() {
    return this.projetForm.get('description');
  }

  get aUneEquipe(): boolean {
    return this.monEquipe !== null;
  }

  ngOnInit(): void {
    this.chargerMonEquipe();
    this.chargerMonProjet();
  }

  chargerMonEquipe(): void {
    this.equipeService.getMonEquipe().subscribe({
      next: (equipe) => {
        this.monEquipe = equipe;
        this.chargerMembres(equipe.id);
      },
      // 404 = l'utilisateur n'appartient a aucune equipe
      error: () => {
        this.monEquipe = null;
        this.membres = [];
      },
    });
  }

  chargerMembres(idEquipe: number): void {
    this.equipeService.getMembres(idEquipe).subscribe({
      next: (membres) => (this.membres = membres),
      error: () => (this.membres = []),
    });
  }

  chargerMonProjet(): void {
    this.chargement = true;
    this.projetService.getMonProjet().subscribe({
      next: (projet) => {
        this.monProjet = projet;
        this.chargement = false;
        // Module 4 - section 10.4 : remplir le formulaire par le code
        this.projetForm.patchValue({
          title: projet.title,
          description: projet.description ?? '',
          githubLink: projet.githubLink ?? '',
        });
      },
      // 404 = l'equipe n'a pas encore soumis de projet
      error: () => {
        this.monProjet = null;
        this.chargement = false;
      },
    });
  }

  onSoumettre(): void {
    if (this.projetForm.invalid) {
      this.projetForm.markAllAsTouched();
      return;
    }

    this.enCours = true;
    this.erreur = '';
    this.succes = '';

    const valeurs = this.projetForm.value;
    const corps = {
      title: valeurs.title!,
      description: valeurs.description!,
      githubLink: valeurs.githubLink?.trim() ? valeurs.githubLink : null,
    };

    // Creation ou modification selon qu'un projet existe deja
    const requete = this.monProjet
      ? this.projetService.modifier(this.monProjet.id, corps)
      : this.projetService.soumettre(corps);

    requete.subscribe({
      next: () => {
        this.succes = this.monProjet ? 'Projet modifie.' : 'Projet soumis.';
        this.enCours = false;
        this.chargerMonProjet();
      },
      error: (err) => {
        this.enCours = false;
        this.erreur = this.erreurService.extraire(err);
      },
    });
  }
}
