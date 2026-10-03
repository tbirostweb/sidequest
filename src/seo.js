export const ORIGIN = 'https://jeu.birostweb.fr'
export function pageMetadata(path, games) {
 const clean=path.replace(/\/$/,'')||'/'
 const game=games.find(g=>clean===`/play/${g.id}`)
 if(game)return {title:`${game.title} — Jouer gratuitement | Sidequest`,description:game.description,path:`/play/${game.id}/`}
 if(clean==='/mentions-legales')return {title:'Mentions légales — Sidequest',description:'Éditeur, hébergement OVHcloud et informations légales de Sidequest, les mini-jeux gratuits de Birostweb.',path:'/mentions-legales/'}
 if(clean==='/confidentialite')return {title:'Confidentialité et données personnelles — Sidequest',description:'Comment Sidequest protège tes données : jeux sans compte, sans publicité et sans traceur. Contacts et droits RGPD.',path:'/confidentialite/'}
 if(clean==='/')return {title:'Sidequest — Jeux gratuits : Snake, morpion, dactylographie et dés',description:'Joue gratuitement à Snake, au morpion, au lancer de dés et à un test de dactylographie français et anglais. Sans compte ni téléchargement.',path:'/'}
 return {title:'Page introuvable — Sidequest',description:'Cette page n’existe pas. Retrouve tous les mini-jeux gratuits de Sidequest.',path:'/404.html',noindex:true}
}
