import { Component, Input } from '@angular/core';

/*
 *  Module 1 - section 3.2 : communication parent -> enfant avec @Input()
 *
 *  Composant reutilisable : affiche une pastille coloree contenant les
 *  initiales d'une personne. La couleur est deduite du texte, donc un meme
 *  utilisateur garde toujours la meme couleur.
 *
 *  Utilisation :
 *    <app-avatar [prenom]="m.utilisateur.prenom" [nom]="m.utilisateur.nom" />
 */
@Component({
  selector: 'app-avatar',
  template: `
    <span class="hk-avatar" [style.background]="couleur" [style.width.px]="taille"
          [style.height.px]="taille" [style.font-size.px]="taille * 0.36" [title]="titre">
      {{ initiales }}
    </span>
  `,
  styles: [
    `
      .hk-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: #fff;
        font-weight: 700;
        letter-spacing: 0.02em;
        flex-shrink: 0;
        box-shadow: 0 2px 6px rgba(20, 22, 48, 0.16);
      }
    `,
  ],
})
export class AvatarComponent {
  @Input() prenom = '';
  @Input() nom = '';
  @Input() texte = '';
  @Input() taille = 36;

  /** Six degrades, choisis de facon deterministe a partir du nom */
  private readonly palettes = [
    'linear-gradient(135deg, #6366f1, #4f46e5)',
    'linear-gradient(135deg, #a78bfa, #7c3aed)',
    'linear-gradient(135deg, #f472b6, #db2777)',
    'linear-gradient(135deg, #34d399, #059669)',
    'linear-gradient(135deg, #fbbf24, #d97706)',
    'linear-gradient(135deg, #38bdf8, #0284c7)',
  ];

  get titre(): string {
    return this.texte || `${this.prenom} ${this.nom}`.trim();
  }

  get initiales(): string {
    if (this.prenom || this.nom) {
      const a = this.prenom.charAt(0);
      const b = this.nom.charAt(0);
      return (a + b).toUpperCase() || '?';
    }
    return (this.texte.substring(0, 2) || '?').toUpperCase();
  }

  get couleur(): string {
    const base = this.titre || '?';
    // Somme des codes de caracteres : toujours la meme couleur pour le meme nom
    let somme = 0;
    for (let i = 0; i < base.length; i++) {
      somme += base.charCodeAt(i);
    }
    return this.palettes[somme % this.palettes.length];
  }
}
