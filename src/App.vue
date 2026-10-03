<script setup>
import { computed,ref,defineAsyncComponent,onMounted,onErrorCaptured } from 'vue'
import catalog from 'virtual:games'
import GameArt from './components/GameArt.vue'
import LegalPage from './pages/LegalPage.vue'
import { Gamepad2, ArrowDown, ArrowUp, Keyboard, Dice5, Grid3X3, Waypoints, ArrowUpRight, ArrowRight, ArrowLeft, Search, Clock, Maximize2 } from '@lucide/vue'
const modules=import.meta.glob('../games/*/Game.vue')
const components=Object.fromEntries(Object.entries(modules).map(([key,loader])=>[key,defineAsyncComponent(loader)]))
const props = defineProps({ initialPath: { type: String, default: '/' } })
const route=ref(props.initialPath.replace(/\/$/, '') || '/'),query=ref(''),category=ref('Tous les jeux'),ready=ref(false),gameError=ref(false)
const legal=computed(()=>['/mentions-legales','/confidentialite'].includes(route.value))
onErrorCaptured(()=>{ gameError.value=true; return false })
const current=computed(()=>catalog.find(g=>route.value===`/play/${g.id}`))
const shown=computed(()=>catalog.filter(g=>(category.value==='Tous les jeux'||g.category===category.value)&&`${g.title} ${g.category} ${g.description}`.toLocaleLowerCase('fr').includes(query.value.toLocaleLowerCase('fr'))))
function documentScroll(){document.getElementById('games')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
function scrollTop(){window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
onMounted(()=>{
 if(location.hash.startsWith('#/')){const legacy=location.hash.slice(1);location.replace(legacy==='/'?'/':legacy.replace(/\/$/,'')+'/');return}
 ready.value=true
})
</script>
<template>
 <div class="site-shell"><a class="skip-link" href="#main-content">Aller au contenu</a>
  <header class="site-nav">
   <a href="/" class="wordmark" aria-label="Sidequest, accueil">SIDEQUEST</a>
   <nav aria-label="Navigation principale"><a href="/" :class="{active:!current}">LES JEUX <span>{{ catalog.length.toString().padStart(2,'0') }}</span></a><a v-for="game in catalog" :key="game.id" :href="`/play/${game.id}/`" :class="{active:current?.id===game.id}">{{ game.title }}</a></nav>
   <span class="nav-status"><span></span> PLAY MODE: ON</span>
  </header>
  <main v-if="!current && route==='/'" class="collection" id="main-content">
   <section class="hero" aria-labelledby="hero-title">
    <picture class="hero-art"><img src="/images/sidequest-mecha-1600.webp" srcset="/images/sidequest-mecha-800.webp 800w, /images/sidequest-mecha-1600.webp 1600w" sizes="100vw" width="1672" height="941" alt="Robot géant rétrofuturiste sous un ciel turquoise" fetchpriority="high" decoding="async"></picture>
    <div class="hero-topline"><span>YOUR DAILY SIDE QUEST</span><span>EST. 2026 / VOL. 01</span></div>
    <div class="hero-title"><span class="title-label">UNE PAUSE. UNE PARTIE.</span><h1 id="hero-title">PRESS<br class="mobile-break"> <em>PLAY.</em></h1><a href="#games" @click.prevent="documentScroll" class="hero-cta">CHOISIS TON JEU <ArrowRight aria-hidden="true" /></a></div>
    <div class="hero-bottom"><span>{{ catalog.length }} JEUX. ZÉRO INSTALLATION.</span><span>SCROLL TO EXPLORE <ArrowDown aria-hidden="true" /></span></div>
   </section>
   <div class="ticker" aria-hidden="true"><span>TA PROCHAINE PAUSE COMMENCE ICI</span><Gamepad2/><span>JUST PLAY. REPEAT.</span><Gamepad2/><span>TA PROCHAINE PAUSE COMMENCE ICI</span><Gamepad2/></div>
   <section id="games" class="games-section">
    <div class="section-intro"><span class="eyebrow">[ LA COLLECTION / {{ catalog.length.toString().padStart(2,'0') }} ]</span><h2>UN PEU DE JEU.<br>BEAUCOUP DE <span>STYLE.</span></h2><p>Vitesse, hasard, stratégie ou réflexes.<br>Le reste peut attendre.</p></div>
    <div class="catalog-tools"><span class="catalog-caption">CHOISIS TA PROCHAINE QUÊTE</span><label class="search"><Search aria-hidden="true"/><input v-model="query" type="search" placeholder="Rechercher un jeu" aria-label="Rechercher un jeu"/></label></div>
    <div class="game-list">
     <article v-for="(game,index) in shown" :key="game.id" class="game-feature" :class="game.art">
      <a :href="`/play/${game.id}/`" class="game-feature-cover">
       <div class="feature-meta"><span>0{{ index+1 }} / {{ game.category }}</span><span>{{ game.tag }}</span></div>
       <GameArt :kind="game.art"/>
       <div class="feature-heading"><span>{{ game.headline || (game.art==='keyboard' ? 'TROUVE TON RYTHME' : 'PROVOQUE LA CHANCE') }}</span><h3>{{ game.title }}</h3></div>
       <span class="feature-launch"><ArrowUpRight aria-hidden="true"/></span>
      </a>
      <div class="feature-details"><div class="detail-cell"><component :is="game.art==='morpion' ? Grid3X3 : game.art==='snake' ? Waypoints : game.art==='keyboard' ? Keyboard : Dice5" aria-hidden="true"/><div><h4>{{ game.detailTitle || (game.art==='keyboard' ? 'CHAQUE FRAPPE COMPTE.' : 'À TOI DE LANCER.') }}</h4><p>{{ game.description }}</p></div></div><div class="detail-cell"><Clock aria-hidden="true"/><div><h4>{{ game.rulesTitle || (game.art==='keyboard' ? 'TON SCORE, TON DÉFI.' : 'TES DÉS, TES RÈGLES.') }}</h4><p>{{ game.rules || (game.art==='keyboard' ? 'De 30 secondes à 2 minutes. Mesure ta vitesse et ta précision en français ou en anglais.' : 'De 1 à 4 dés et jusqu’à 20 faces. Configure ton lancer, le hasard fait le reste.') }}</p><a :href="`/play/${game.id}/`">LANCER UNE PARTIE <ArrowRight aria-hidden="true"/></a></div></div></div>
     </article>
    </div>
    <div v-if="!shown.length" class="empty-state"><Search aria-hidden="true"/><h3>Aucun jeu trouvé</h3><button class="button" @click="query='';category='Tous les jeux'">Voir tous les jeux</button></div>
   </section>
   <footer class="site-footer"><a href="/" class="wordmark">SIDEQUEST</a><span>FAIT POUR LE PLAISIR DE JOUER.</span><a href="#top" @click.prevent="scrollTop">RETOUR EN HAUT <ArrowUp aria-hidden="true"/></a></footer>
  </main>
  <LegalPage v-else-if="legal" :privacy="route==='/confidentialite'"/>
  <main v-else-if="current" class="play-page" id="main-content"><div class="play-toolbar"><a href="/"><ArrowLeft aria-hidden="true"/> LA COLLECTION</a><span>{{ current.category }} / SOLO</span></div><section v-if="gameError" class="empty-state" role="alert"><h1>Le jeu n’a pas pu démarrer</h1><p>Recharge la page pour réessayer.</p><a class="button" :href="`/play/${current.id}/`">Réessayer</a></section><section v-else-if="!ready" class="game-loading" aria-live="polite"><h1>{{ current.title }}</h1><p>{{ current.description }}</p><p>Préparation du jeu…</p></section><component v-else-if="current.type==='vue'" :is="components[current.componentKey]" :key="current.id"/><template v-else><div class="game-instructions"><h1>{{ current.title }}</h1><a class="button" :href="current.url" target="_blank" rel="noopener">Plein écran <Maximize2 aria-hidden="true"/></a></div><iframe class="external-game" :src="current.url" :title="current.title" sandbox="allow-scripts" allow="fullscreen"/></template></main>
  <main v-else class="empty-state" id="main-content"><span class="eyebrow">ERREUR 404</span><h1>Cette page n’existe pas.</h1><p>Retrouve les quatre jeux dans la collection.</p><a class="button" href="/">Retour à la collection</a></main>
 <footer class="legal-footer"><a href="/mentions-legales/">Mentions légales</a><a href="/confidentialite/">Confidentialité</a><a href="mailto:contact@theo-birost.fr">Contact</a><span>© {{ new Date().getFullYear() }} Théo Birost</span></footer>
 <a v-if="route==='/'" href="#games" @click.prevent="documentScroll" class="mobile-play">Choisir un jeu <ArrowDown aria-hidden="true"/></a>
 </div>
</template>
