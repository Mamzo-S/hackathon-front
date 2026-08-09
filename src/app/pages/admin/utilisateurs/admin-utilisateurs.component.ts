import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ErreurService } from '../../../services/erreur.service';
import { AuthService } from '../../../services/auth.service';
import { Utilisateur } from '../../../models/utilisateur.model';
import { AvatarComponent } from '../../../partages/avatar/avatar.component';

/*
 *  Espace ADMINISTRATEUR : gestion des comptes.
 *  C'est le seul endroit ou l'on peut creer un compte JURY : l'inscription
 *  publique force toujours ROLE_PARTICIPANT.
 */
@Component({
  selector: 'app-admin-utilisateurs',
  imports: [ReactiveFormsModule, AvatarComponent],
  templateUrl: './admin-utilisateurs.component.html',
})
export class AdminUtilisateursComponent implements OnInit {
  utilisateurs: Utilisateur[] = [];

  utilisateurForm = this.fb.group({
    prenom: ['', [Validators.required]],
    nom: ['', [Validators.required]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    role: ['ROLE_JURY', [Validators.required]],
  });

  chargement = true;
  enCours = false;
  erreur = '';
  succes = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private erreurService: ErreurService,
    private authService: AuthService,
  ) {}

  get username() {
    return this.utilisateurForm.get('username');
  }

  get password() {
    return this.utilisateurForm.get('password');
  }

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement = true;
    this.adminService.getUtilisateurs().subscribe({
      next: (donnees) => {
        this.utilisateurs = donnees;
        this.chargement = false;
      },
      error: (err) => this.echouer(err),
    });
  }

  onCreer(): void {
    if (this.utilisateurForm.invalid) {
      this.utilisateurForm.markAllAsTouched();
      return;
    }

    this.demarrer();
    const v = this.utilisateurForm.value;

    this.adminService
      .creerUtilisateur({
        nom: v.nom!,
        prenom: v.prenom!,
        username: v.username!,
        password: v.password!,
        role: v.role!,
      })
      .subscribe({
        next: (u) => {
          this.succes = `Compte ${u.username} cree.`;
          this.utilisateurForm.reset({ role: 'ROLE_JURY' });
          this.enCours = false;
          this.charger();
        },
        error: (err) => this.echouer(err),
      });
  }

  onSupprimer(u: Utilisateur): void {
    if (!confirm(`Supprimer definitivement le compte ${u.username} ?`)) {
      return;
    }
    this.demarrer();
    this.adminService.supprimerUtilisateur(u.id).subscribe({
      next: (reponse) => {
        this.succes = reponse.message;
        this.enCours = false;
        this.charger();
      },
      error: (err) => this.echouer(err),
    });
  }

  /** Empeche l'administrateur connecte de supprimer son propre compte */
  estMoi(u: Utilisateur): boolean {
    return u.username === this.authService.getUsername();
  }

  libelleRoles(u: Utilisateur): string {
    return u.roles.map((r) => r.replace('ROLE_', '')).join(', ');
  }

  couleurRole(u: Utilisateur): string {
    if (u.roles.includes('ROLE_ADMIN')) return 'hk-badge-rose';
    if (u.roles.includes('ROLE_JURY')) return 'hk-badge-violet';
    return 'hk-badge-indigo';
  }

  private demarrer(): void {
    this.enCours = true;
    this.erreur = '';
    this.succes = '';
  }

  private echouer(err: unknown): void {
    this.enCours = false;
    this.chargement = false;
    this.erreur = this.erreurService.extraire(err);
  }
}
