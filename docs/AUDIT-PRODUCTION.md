# Audit Sidequest — 10 septembre 2026

Périmètre : Vue 3 / JavaScript, Vite, HTML pré-généré, Nginx dans Docker, déploiement GitHub → Dokploy / OVH. Domaine : https://jeu.birostweb.fr. Aucun backend métier, compte, base de données ni collecte des scores. Les validations locales ne prouvent pas que la nouvelle version est déjà déployée.

| Point | Statut | Résultat ou action restante |
|---|---|---|
| 1. Secrets | OK | Aucun secret requis par l’application. Ne jamais injecter un secret dans une variable VITE_ : elle devient publique. Toute future clé serveur reste dans Environment Dokploy et nécessite un backend. |
| 2. .env ignoré | OK | .env* exclu de Git et de Docker. |
| 3. Hash des mots de passe | non applicable | Aucun compte. |
| 4. Permissions serveur | non applicable | Aucune action privilégiée ni API ; fichiers statiques publics. |
| 5. Validation serveur | non applicable | Aucun input envoyé au serveur. Interpolation Vue échappée ; CSP ajoutée. |
| 6. Rate limiting login | non applicable | Aucun login. |
| 7. Sessions | non applicable | Aucune session serveur. |
| 8. Erreurs de production | OK | Build production, aucun console.log dans le code client, erreurs de jeux interceptées, journaux Nginx limités aux événements critiques. Les logs de compilation restent disponibles. |
| 9. Erreur client générique | OK | Message avec action Réessayer ; aucun détail technique affiché. |
| 10. CORS | non applicable | Aucun service cross-origin ; aucun Access-Control-Allow-Origin permissif. CSP connect-src self. |
| 11. Uploads | non applicable | Aucun upload. Requêtes limitées à 1 Mo par Nginx. |
| 12. Dépendances | OK | npm ci reproductible, npm audit : 0 vulnérabilité connue. Une version majeure plus récente n’impose pas une migration sans besoin ; refaire l’audit à chaque livraison. |
| 13. Webhooks | non applicable | Aucun webhook applicatif. Les intégrations GitHub/Dokploy relèvent de leur configuration administrateur. |
| 14. RLS | non applicable | Pas de Postgres/Supabase. |
| 15. HTTPS | OK | Domaine public vérifié avec validation TLS et redirection HTTP 308 vers HTTPS. HSTS ajouté à la configuration livrée. |
| 16. Backup DB | non applicable | Aucune base de données ni volume de données pour les jeux. |
| 17. DNS | OK | Résolution A observée : 152.228.130.105. Vérification locale, pas une preuve depuis chaque résolveur mondial. |
| 18. Santé/redémarrage | à corriger | HEALTHCHECK /health livré. Vérifier dans Dokploy la politique de redémarrage du service (condition any), son état healthy et tester un redémarrage. Le Dockerfile ne peut pas imposer la politique de l’orchestrateur. |
| 19. Mentions légales | à corriger | Page ajoutée avec coordonnées publiées sur Birostweb, hébergeur et contact. Numéro de téléphone de l’éditeur absent à la demande de l’utilisateur : réserve de conformité, à compléter pour un site professionnel. |
| 20. Confidentialité | à corriger | Page ajoutée et adaptée aux données réellement utilisées. Vérifier la rétention des logs OVH/proxy Dokploy puis renseigner une durée exacte ou des critères précis dans la page ; aucune durée serveur inventée. |
| 21. Cookies | non applicable | Aucun tracker, cookie ou outil d’audience installé. Aucun bandeau nécessaire dans cette version. Bloquer tout futur tracker soumis au consentement avant acceptation. |
| 22. Titres | OK | Titres propres à l’accueil, chaque jeu et chaque page légale, présents dans le HTML initial. |
| 23. Descriptions | OK | Meta description propre à chaque page. |
| 24. Robots/sitemap | OK | Générés au build pour jeu.birostweb.fr ; 404 exclue du sitemap et noindex. |
| 25. Images alt | OK | Illustration principale décrite, dimensions explicites ; décorations SVG. |
| 26. Liens internes | OK | URLs directes vers chaque jeu, accueil et pages légales ; anciens liens hash conservés via redirection navigateur. |
| 27. Open Graph | OK | Métadonnées pré-générées et image de partage locale WebP ; canonical absolu. |
| 28. Lighthouse | OK | Lighthouse 100/100 en performances, accessibilité, bonnes pratiques et SEO sur mobile et desktop (accueil local). Rapports dans reports/, à relancer sur le domaine après déploiement. Les scores sont des mesures de laboratoire, pas des données utilisateurs réelles. |
| 29. Analytics | non applicable | Choix de cette version : aucun suivi d’audience. Aucun compte ou identifiant analytics fourni. |
| 30. 404 | OK | Page personnalisée et véritable statut HTTP 404, y compris pour une ressource manquante. |
| 31. CTA/mobile | OK | CTA dans le premier écran, raccourci fixe mobile, cartes sans débordement à 390 px, navigation et accès clavier. |

## Modifications livrées

Visuel principal remplacé par deux WebP responsives (environ 145 Ko et 51 Ko contre 2,5 Mo), chargement prioritaire du visuel, taille réservée et chargement des jeux à la demande. Pages HTML générées pour les robots et liens partagés. Gzip, cache long des assets versionnés, revalidation HTML, CSP, protections d’iframe, nosniff, referrer et permissions navigateur. Aucune police distante, publicité ou collecte ajoutée.

## Trois priorités restantes

1. Déployer ces modifications puis vérifier la santé et la politique de redémarrage dans Dokploy. Tester un redémarrage et les routes directes sur le domaine.
2. Lever la réserve sur le téléphone professionnel des mentions légales, volontairement omis.
3. Vérifier la politique réelle des logs du proxy/hébergeur et préciser leur rétention dans la confidentialité.

## Sources

Coordonnées reprises de https://birostweb.fr/mentions-legales.html (sans vérification indépendante du registre).
Obligations des sites professionnels : https://entreprendre.service-public.gouv.fr/vosdroits/F31228.
Cookies et consentement : https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi.

## Vérification finale — 10 septembre, 11 h 55 (Paris)

Image Docker reconstruite sans erreur, 16 tests unitaires réussis et conteneur healthy. Contrôle Playwright réussi sur l’image finale puis sur https://jeu.birostweb.fr : sept pages, quatre jeux interactifs, viewport mobile 390 px sans débordement, anciens liens hash et véritable 404. En-têtes CSP, HSTS et protections HTTP présents sur le domaine public. La politique de redémarrage Dokploy et la rétention des logs restent non vérifiables sans accès administrateur. La dernière correction du script de pré-génération est locale ; le site public contient déjà les optimisations principales.
