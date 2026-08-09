import { Pipe, PipeTransform } from '@angular/core';

/*
 *  Module 1 - section 2.2 : creer un pipe personnalise.
 *
 *  Pourquoi ne pas utiliser simplement le pipe "date" d'Angular ?
 *
 *  Selon la configuration du serveur, une date Java peut arriver sous DEUX
 *  formes differentes :
 *
 *      "2026-08-09T14:39:39"          chaine ISO-8601 (format attendu)
 *      [2026, 8, 9, 14, 39, 39]       tableau d'entiers (Jackson sans le
 *                                     module java.time enregistre)
 *
 *  Le pipe "date" d'Angular LEVE UNE EXCEPTION sur la seconde forme, et cette
 *  exception interrompt tout le cycle de rendu : une seule mauvaise date
 *  suffit a vider un tableau entier a l'ecran.
 *
 *  Ce pipe accepte les deux formes, renvoie un tiret quand la valeur est
 *  absente, et ne leve jamais d'exception.
 */
@Pipe({
  name: 'dateFr',
})
export class DateFrPipe implements PipeTransform {
  transform(valeur: unknown, avecHeure = false): string {
    const date = this.convertir(valeur);

    if (date === null || isNaN(date.getTime())) {
      return '—';
    }

    const jour = this.deuxChiffres(date.getDate());
    const mois = this.deuxChiffres(date.getMonth() + 1);
    const annee = date.getFullYear();

    if (!avecHeure) {
      return `${jour}/${mois}/${annee}`;
    }

    const heures = this.deuxChiffres(date.getHours());
    const minutes = this.deuxChiffres(date.getMinutes());
    return `${jour}/${mois}/${annee} a ${heures}h${minutes}`;
  }

  /** Transforme la valeur recue en objet Date, quelle que soit sa forme */
  private convertir(valeur: unknown): Date | null {
    if (valeur === null || valeur === undefined || valeur === '') {
      return null;
    }

    // Forme 1 : tableau [annee, mois, jour, heure, minute, seconde]
    // Attention : en JavaScript, les mois vont de 0 a 11, d'ou le "- 1"
    if (Array.isArray(valeur)) {
      const [a, m, j, h = 0, min = 0, s = 0] = valeur as number[];
      if (a === undefined || m === undefined || j === undefined) {
        return null;
      }
      return new Date(a, m - 1, j, h, min, s);
    }

    // Forme 2 : chaine ISO-8601
    if (typeof valeur === 'string') {
      return new Date(valeur);
    }

    // Forme 3 : horodatage en millisecondes
    if (typeof valeur === 'number') {
      return new Date(valeur);
    }

    if (valeur instanceof Date) {
      return valeur;
    }

    return null;
  }

  private deuxChiffres(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }
}
