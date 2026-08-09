/*
 *  Module 5 - section 13.1 : les interfaces TypeScript vont dans models/
 *  Ces interfaces sont le miroir exact des DTO renvoyes par l'API Spring
 *  (package com.gl.dto cote backend).
 */

export type RoleName = 'ROLE_ADMIN' | 'ROLE_PARTICIPANT' | 'ROLE_JURY';

/** Corps envoye a POST /api/auth/login */
export interface LoginRequete {
  username: string;
  password: string;
}

/** Reponse de POST /api/auth/login */
export interface LoginReponse {
  username: string;
  token: string;
  roles: RoleName[];
}

/** Corps envoye a POST /api/auth/register */
export interface InscriptionRequete {
  nom: string;
  prenom: string;
  username: string;
  password: string;
  role?: string;
}

/** Un utilisateur tel que renvoye par l'API (jamais de mot de passe) */
export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  username: string;
  roles: RoleName[];
}

/** Corps d'erreur renvoye par GlobalExceptionHandler cote Spring */
export interface ErreurApi {
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface MessageReponse {
  message: string;
}

/** Reponse de GET et POST /api/admin/results */
export interface StatutResultats {
  publies: boolean;
  message: string;
}
