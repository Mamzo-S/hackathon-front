import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LigneClassement } from '../models/evaluation.model';

/*
 *  GET /api/leaderboard — endpoint public, aucun token requis.
 *
 *  ------------------------------------------------------------------------
 *  RxResource (exige par le cahier des charges du TP1, section 9)
 *  ------------------------------------------------------------------------
 *  Le cours utilise partout la methode classique : le service renvoie un
 *  Observable, le composant s'y abonne avec subscribe() et gere lui-meme
 *  les variables "chargement" et "erreur" (Module 2 - section 5.4).
 *
 *  rxResource, apparu avec les Signals d'Angular, fait ces trois choses a
 *  notre place. Il enveloppe le meme Observable et expose :
 *      .value()      les donnees recues
 *      .isLoading()  true pendant le chargement
 *      .error()      l'erreur eventuelle
 *      .reload()     relance la requete
 *  Il se desabonne aussi tout seul, comme le pipe async
 *  (Module 5 - section 13.2).
 *
 *  Les deux approches sont fournies ici pour montrer l'equivalence :
 *  getClassement() est la version du cours, "classement" la version
 *  rxResource utilisee par le composant.
 */
@Injectable({
  providedIn: 'root',
})
export class ClassementService {
  private url = `${environment.apiUrl}/leaderboard`;

  constructor(private http: HttpClient) {}

  /** Version du cours : le composant fera .subscribe() */
  getClassement(): Observable<LigneClassement[]> {
    return this.http.get<LigneClassement[]>(this.url);
  }

  /** Version RxResource : le composant lit directement les signals */
  readonly classement = rxResource({
    stream: () => this.http.get<LigneClassement[]>(this.url),
    defaultValue: [] as LigneClassement[],
  });

  rafraichir(): void {
    this.classement.reload();
  }
}
