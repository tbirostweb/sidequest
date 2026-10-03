# Sidequest

Collection de quatre jeux en Vue 3 et JavaScript : Type Rush, Roll Dice, Morpion et Snake. Le site est statique et peut être déployé depuis GitHub sur Dokploy avec le Dockerfile à la racine.

## Développement

Node.js 22 recommandé.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

## Organisation

```text
site-jeu/
├── games/
│   ├── typing/       Dactylographie français / anglais
│   ├── Roll-Dice/    Lancer de dés
│   ├── morpion/      Ordinateur ou deux joueurs locaux
│   └── snake/        Clavier et commandes tactiles
├── src/              Portail et styles communs
├── public/           Images du site
├── scripts/          Détection des jeux et tests
├── deploy/
│   └── nginx.conf    Serveur HTTP de production
├── Dockerfile        Build Node puis serveur Nginx
├── .dockerignore
└── .github/workflows/ci.yml
```

## Déployer depuis GitHub avec Dokploy

### 1. Mettre le projet sur GitHub

Créer un dépôt GitHub vide puis y envoyer le contenu de ce dossier, avec le Dockerfile à la racine. Inclure `package-lock.json`, `public/images/`, `deploy/`, `games/`, `src/` et `scripts/`. Ne pas envoyer `node_modules` ni `dist` : ils sont reconstruits automatiquement.

Le dépôt local est déjà initialisé. Si aucun remote `origin` n’existe, le raccorder à **votre** URL GitHub avec `git remote add origin URL_DU_DEPOT`. Si `origin` existe, vérifier sa destination avec `git remote -v` avant de la modifier. Faire un commit des fichiers puis pousser la branche souhaitée ; ne pas forcer un push sur un dépôt existant.

### 2. Configurer l’application Dokploy

1. Connecter GitHub dans les sources Git de Dokploy et autoriser l’accès au dépôt.
2. Créer un projet puis un service **Application**.
3. Sélectionner la source **GitHub**, le dépôt et la branche que vous avez poussée.
4. Régler le type de build sur **Dockerfile**.
5. Indiquer `Dockerfile` comme chemin de Dockerfile et `.` comme contexte Docker (racine du dépôt ; chemin de build `/` si ce champ est proposé).
6. Lancer **Deploy**.
7. Ajouter un domaine pointant vers le serveur Dokploy, avec le **port interne 80**, puis activer HTTPS.

Aucune variable d’environnement, base de données ou volume n’est nécessaire. Le démarrage de Nginx est déjà défini dans le Dockerfile : ne pas configurer `npm run dev` comme commande de production. Le domaine doit servir ce projet à la racine `/`, pas sous un préfixe tel que `/sidequest/`.

Le contrôle de santé est disponible sur `/health` (HTTP 200). Le Dockerfile le configure automatiquement. Le port 80 est le port du conteneur, pas le port 5173 utilisé en développement.

### 3. Mises à jour

Activer **Auto Deploy** dans Dokploy pour la branche choisie afin de redéployer après les prochains pushes. Le workflow GitHub Actions fourni construit et teste l’image sur chaque push et pull request ; il ne publie pas d’image et ne déclenche pas lui-même Dokploy. Dokploy effectue son propre build depuis GitHub.

Références : [sources et applications Dokploy](https://docs.dokploy.com/docs/core/applications), [types de build](https://docs.dokploy.com/docs/core/applications/build-type), [déploiement automatique](https://docs.dokploy.com/docs/core/auto-deploy).

## Vérifier Docker localement

Avec Docker démarré :

```sh
docker build -t sidequest:local .
docker run --rm -p 8080:80 sidequest:local
```

Ouvrir `http://localhost:8080`. Contrôler `http://localhost:8080/health`. L’image lance les tests puis compile les jeux ; l’étape finale ne contient que Nginx et les fichiers compilés. Les ressources JavaScript/CSS versionnées sont mises en cache ; le document HTML est revalidé pour récupérer les nouvelles versions.

## Jeux

- **Type Rush** : 30, 60 ou 120 secondes, départ à la première lettre. Espace ou Entrée valide un mot. Résultat indicatif, sans certification officielle.
- **Roll Dice** : 1 à 4 dés de 1 à 20 faces, commandes verrouillées pendant le lancer.
- **Morpion** : contre l’ordinateur ou à deux sur le même appareil. X commence. Changer de mode relance une partie.
- **Snake** : flèches, ZQSD/WASD ou boutons tactiles. Espace met en pause. Le jeu se met aussi en pause quand l’onglet est masqué. Aucun déplacement diagonal ni demi-tour immédiat.

La navigation utilise des pages HTML pré-générées `/play/identifiant/`, avec titre, description et canonical propres. Les anciens liens `#/play/identifiant` sont redirigés dans le navigateur. Les parties sont locales au navigateur, sans serveur multijoueur. Les données de l’ancien jeu de ferme ne sont plus utilisées.

## Ajouter un jeu

### Vue

Créer un dossier `games/nom-du-jeu/` contenant `Game.vue`. Utiliser des styles isolés `<style scoped>` directement dans le composant. Nettoyer les temporisateurs et événements dans `onUnmounted`. Installer les dépendances dans le projet principal.

### HTML / JavaScript

Déposer un dossier contenant un `index.html` avec ses ressources et des liens relatifs. Le jeu sera affiché dans un iframe isolé. Un projet React/Vue complet doit être compilé auparavant, ou adapté au format `Game.vue`. Les jeux nécessitant une API serveur ou du stockage dans l’iframe demandent une intégration adaptée.

### Carte de présentation

Ajouter un `game.json` :

```json
{
  "id": "mon-jeu",
  "title": "Mon jeu",
  "category": "Arcade",
  "description": "Les règles en une phrase.",
  "duration": "~ 2 min",
  "tag": "SOLO",
  "art": "dice",
  "headline": "À TOI DE JOUER",
  "detailTitle": "LE PRINCIPE.",
  "rulesTitle": "LES RÈGLES.",
  "rules": "Comment jouer."
}
```

L’identifiant doit être unique, en minuscules et tirets. Illustrations disponibles : `keyboard`, `dice`, `morpion`, `snake`. Les jeux sont découverts automatiquement. Relancer le serveur local si la copie du dossier était encore en cours ; reconstruire/redéployer pour mettre la production à jour.

## Production et audit

Domaine configuré : **https://jeu.birostweb.fr** (`src/seo.js`). Le build produit les pages de chaque jeu, les mentions légales, la confidentialité, une véritable 404, `robots.txt` et `sitemap.xml`. Les images sont des WebP responsives locales ; aucun tracker n’est installé.

L’audit détaillé et les réserves d’infrastructure/légales sont dans [docs/AUDIT-PRODUCTION.md](docs/AUDIT-PRODUCTION.md). Dans Dokploy, vérifier la politique de redémarrage (condition `any`) et la rétention des journaux du proxy ; un HEALTHCHECK seul ne définit pas de politique de redémarrage.

Pour reproduire le contrôle navigateur, après avoir démarré le conteneur sur le port 8087 :

```sh
npx playwright install chromium
node scripts/check-browser.mjs
```

Une autre adresse peut être fournie via `TEST_URL`. Les rapports Lighthouse de travail restent dans `reports/`, exclus de Git et de l’image Docker.
