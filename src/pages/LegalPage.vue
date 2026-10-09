<script setup>
defineProps({ privacy: Boolean })
</script>
<template>
 <main class="legal-page" id="main-content">
  <a href="/" class="legal-back">Retour aux jeux</a>
  <span class="eyebrow">SIDEQUEST / INFORMATIONS</span>
  <h1>{{ privacy ? 'Politique de confidentialité' : 'Mentions légales' }}</h1>
  <p class="legal-date">Dernière mise à jour : 10 septembre 2026.</p>
  <template v-if="!privacy">
   <h2>Éditeur et responsable de la publication</h2>
   <p>Sidequest, accessible sur jeu.birostweb.fr, est édité par <strong>Théo Birost</strong>, entrepreneur individuel (EI), sous le nom commercial Birostweb. Directeur de la publication : Théo Birost.</p>
   <p>SIREN : 108 892 993 · SIRET : 108 892 993 00016.<br>Code APE : 62.01Z — Programmation informatique.<br>Adresse : 6 rue Georges Guynemer, 10450 Bréviandes, France.<br>Contact : <a href="mailto:contact@theo-birost.fr">contact@theo-birost.fr</a>.<br>TVA non applicable, article 293 B du CGI.</p>
   <p>Informations d’éditeur reprises des <a href="https://birostweb.fr/mentions-legales.html">mentions légales de Birostweb</a>.</p>
   <h2>Hébergement</h2><p>Le site est hébergé sur un VPS OVHcloud, administré avec Dokploy.<br>OVH SAS — 2 rue Kellermann, 59100 Roubaix, France.<br>Téléphone : 1007. Site : <a href="https://www.ovhcloud.com/fr/">ovhcloud.com</a>.</p>
   <h2>Contenus et licences</h2><p>Les textes, la présentation et les éléments originaux du site sont protégés par le droit applicable. Les composants tiers restent soumis à leurs licences respectives, notamment Vue et Lucide. Le visuel de robot est une illustration générée par intelligence artificielle. Les marques et contenus tiers appartiennent à leurs titulaires.</p>
   <h2>Utilisation des jeux</h2><p>Les jeux sont proposés gratuitement, sans mise financière ni gain monétaire. Le lancer de dés utilise un générateur pseudo-aléatoire pour un usage ludique. Le résultat de dactylographie est indicatif et ne constitue pas une certification officielle.</p>
   <p>L’éditeur s’efforce de maintenir le site accessible et fonctionnel. Des interruptions ou erreurs peuvent survenir. Ces informations ne limitent pas les droits légaux des utilisateurs.</p>
   <h2>Données personnelles</h2><p>Consulte la <a href="/confidentialite/">politique de confidentialité</a> pour connaître le fonctionnement du site et exercer tes droits.</p>
  </template>
  <template v-else>
   <h2>Responsable du traitement</h2><p>Théo Birost — Birostweb, 6 rue Georges Guynemer, 10450 Bréviandes, France. Contact : <a href="mailto:contact@theo-birost.fr">contact@theo-birost.fr</a>.</p>
   <h2>Jeux sans compte</h2><p>Aucun compte, formulaire de paiement, publicité ou classement nominatif n’est proposé. Les frappes, parties et scores sont traités dans ton navigateur. Ils ne sont pas envoyés à l’éditeur. Les parties en cours sont conservées en mémoire et réinitialisées lorsque la page est quittée ou rechargée.</p>
   <h2>Cookies, stockage et mesure d’audience</h2><p>Cette version n’installe aucun cookie, traceur publicitaire ni outil de mesure d’audience. Les images, polices système et scripts sont servis sans appel automatique à un service tiers. Aucun consentement aux cookies n’est donc demandé. Si des traceurs non essentiels sont ajoutés, ils devront rester désactivés jusqu’à ton consentement préalable, retirable à tout moment.</p>
   <p>L’ancienne ferme a pu enregistrer une sauvegarde locale sous la clé <code>farmIdleGame</code>. Les jeux actuels ne la lisent plus. Tu peux la supprimer en effaçant les données de ce site dans les réglages de ton navigateur.</p>
   <h2>Données techniques</h2><p>Le serveur reçoit les informations indispensables à la connexion, dont l’adresse IP et les caractéristiques de la requête. La configuration Nginx livrée avec le projet désactive les journaux d’accès et limite les journaux d’erreurs aux événements critiques. L’hébergeur et le proxy Dokploy peuvent traiter des données techniques pour la sécurité et l’exploitation, sur la base de l’intérêt légitime à assurer le fonctionnement du service.</p>
   <p>Ces données sont accessibles uniquement à l’éditeur et aux prestataires techniques intervenant pour l’hébergement. Les durées de rétention des journaux d’infrastructure dépendent de la configuration du serveur ; elles peuvent être précisées sur demande à l’éditeur. Les scores et le contenu saisi dans les jeux ne figurent pas dans ces journaux.</p>
   <h2>Contact par email</h2><p>Si tu nous écris, ton adresse et ton message servent à répondre à ta demande, sur la base de notre intérêt légitime à traiter les échanges. Les messages sont conservés au plus 12 mois après le dernier échange, sauf nécessité légale ou relation contractuelle en cours, conformément à la politique publiée par Birostweb.</p>
   <h2>Hébergement et destinataires</h2><p>Le site est hébergé par OVHcloud. Les données ne sont ni vendues ni utilisées pour du profilage publicitaire. Aucun transfert supplémentaire n’est mis en œuvre par le code des jeux ; les conditions d’hébergement et de messagerie relèvent des contrats de l’éditeur avec ses prestataires.</p>
   <h2>Tes droits</h2><p>Selon les conditions prévues par le RGPD, tu peux demander l’accès, la rectification, l’effacement, la limitation ou t’opposer au traitement de tes données. Écris à <a href="mailto:contact@theo-birost.fr">contact@theo-birost.fr</a>. Une réponse est apportée dans le délai légal, en principe un mois. Tu peux également adresser une réclamation à la <a href="https://www.cnil.fr/fr/plaintes">CNIL</a>.</p>
   <p>Consulte également les <a href="/mentions-legales/">mentions légales</a>.</p>
  </template>
 </main>
</template>
