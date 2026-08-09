import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErreurService } from '../../../services/erreur.service';

/*
 *  Module 4 - section 10.3 : validateur personnalise
 *  Ici on verifie que la confirmation correspond au mot de passe.
 */
function motsDePasseIdentiques(groupe: AbstractControl): ValidationErrors | null {
  const mdp = groupe.get('motDePasse')?.value;
  const confirmation = groupe.get('confirmation')?.value;
  return mdp === confirmation ? null : { motsDePasseDifferents: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './auth.css',
})
export class RegisterComponent {
  inscriptionForm = this.fb.group(
    {
      prenom: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      motDePasse: ['', [Validators.required, Validators.minLength(4)]],
      confirmation: ['', [Validators.required]],
    },
    { validators: motsDePasseIdentiques },
  );

  erreur = '';
  chargement = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private erreurService: ErreurService,
    private router: Router,
  ) {}

  get prenom() {
    return this.inscriptionForm.get('prenom');
  }

  get nom() {
    return this.inscriptionForm.get('nom');
  }

  get username() {
    return this.inscriptionForm.get('username');
  }

  get motDePasse() {
    return this.inscriptionForm.get('motDePasse');
  }

  onSoumettre(): void {
    if (this.inscriptionForm.invalid) {
      this.inscriptionForm.markAllAsTouched();
      return;
    }

    this.chargement = true;
    this.erreur = '';
    const valeurs = this.inscriptionForm.value;

    this.authService
      .inscription({
        nom: valeurs.nom!,
        prenom: valeurs.prenom!,
        username: valeurs.username!,
        password: valeurs.motDePasse!,
      })
      .subscribe({
        next: () => this.router.navigate(['/login'], { queryParams: { inscrit: 1 } }),
        error: (err) => {
          this.chargement = false;
          this.erreur = this.erreurService.extraire(err);
        },
      });
  }
}
