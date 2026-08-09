import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErreurService } from '../../../services/erreur.service';

/*
 *  Module 5 - section 11.5 : composant de Login
 *  Module 4 - section 10.2 : formulaire reactif avec FormBuilder
 */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './auth.css',
})
export class LoginComponent {
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    motDePasse: ['', [Validators.required, Validators.minLength(4)]],
  });

  erreur = '';
  chargement = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private erreurService: ErreurService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  // Getters : raccourcis utilises dans le template pour la validation
  get username() {
    return this.loginForm.get('username');
  }

  get motDePasse() {
    return this.loginForm.get('motDePasse');
  }

  onSoumettre(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.chargement = true;
    this.erreur = '';
    const { username, motDePasse } = this.loginForm.value;

    this.authService.login(username!, motDePasse!).subscribe({
      next: () => {
        // Module 3 - section 8.2 : revenir sur la page demandee avant le login
        // Chaque role a son propre espace : /participant, /jury ou /admin
        const retour =
          this.route.snapshot.queryParamMap.get('returnUrl') || this.authService.accueilSelonRole();
        this.router.navigateByUrl(retour);
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = this.erreurService.extraire(err);
      },
    });
  }
}
