/*
 *  Module 2 - section 6.3 : Environnements de configuration
 *  Fichier utilise par "ng serve" (developpement)
 */
export const environment = {
  production: false,

  /*
   *  URL de l'API Spring MVC deployee sur Tomcat.
   *  "/gestionHackathon" est le contexte de l'application, defini dans IntelliJ :
   *  Edit Configurations -> onglet Deployment -> champ "Application context".
   *
   *  Verification : ouvrir http://localhost:8080/gestionHackathon/api/leaderboard
   *  dans le navigateur. Si la page 404 de Tomcat s'affiche, le contexte est
   *  different (souvent "/gestionHackathon_war_exploded").
   */
  apiUrl: 'http://localhost:8080/gestionHackathon/api',
};
