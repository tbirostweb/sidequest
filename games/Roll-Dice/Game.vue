<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { Minus, Plus, RotateCcw, ArrowUpRight } from '@lucide/vue'
const diceCount=ref(2),faces=ref(6),values=ref([]),rolling=ref(false)
const total=computed(()=>values.value.reduce((sum,value)=>sum+value,0))
let timer
function configure(setting,step){if(rolling.value)return; if(setting==='dice')diceCount.value=Math.min(4,Math.max(1,diceCount.value+step));else faces.value=Math.min(20,Math.max(1,faces.value+step));values.value=[]}
function roll(){if(rolling.value)return;rolling.value=true;values.value=[];timer=setTimeout(()=>{values.value=Array.from({length:diceCount.value},()=>Math.floor(Math.random()*faces.value)+1);rolling.value=false},450)}
function reset(){clearTimeout(timer);rolling.value=false;diceCount.value=2;faces.value=6;values.value=[]}
onUnmounted(()=>clearTimeout(timer))
</script>
<template>
 <div class="game-ui dice-game">
  <header class="game-header"><span class="eyebrow">LANCER DE DÉS</span><h1>Roll Dice</h1><p>Choisis le nombre de dés et de faces, puis lance les dés.</p></header>
  <section class="settings" aria-label="Configuration des dés">
   <div class="setting"><span>Nombre de dés</span><div class="stepper"><button @click="configure('dice',-1)" :disabled="rolling||diceCount===1" aria-label="Retirer un dé"><Minus aria-hidden="true" /></button><output>{{ diceCount }}</output><button @click="configure('dice',1)" :disabled="rolling||diceCount===4" aria-label="Ajouter un dé"><Plus aria-hidden="true" /></button></div></div>
   <div class="setting"><span>Faces par dé</span><div class="stepper"><button @click="configure('faces',-1)" :disabled="rolling||faces===1" aria-label="Retirer une face"><Minus aria-hidden="true" /></button><output>{{ faces }}</output><button @click="configure('faces',1)" :disabled="rolling||faces===20" aria-label="Ajouter une face"><Plus aria-hidden="true" /></button></div></div>
   <button class="secondary" @click="reset"><RotateCcw aria-hidden="true" /> Réinitialiser</button>
  </section>
  <section class="stats" aria-label="Résultats"><div><span>Dés lancés</span><strong>{{ diceCount }}<small>/ 4</small></strong></div><div><span>Faces par dé</span><strong>{{ faces }}</strong></div><div><span>Total du lancer</span><strong>{{ values.length ? total : '—' }}</strong></div></section>
  <section class="test dice-panel"><div class="test-heading"><h2><span class="status-dot" aria-hidden="true"></span>{{ rolling ? 'Lancer en cours' : values.length ? 'Résultat du lancer' : 'Prêt à lancer ?' }}</h2><span class="terminal-label">{{ diceCount }} D{{ faces }}</span></div>
   <div class="dice-tray" :class="{rolling}" aria-label="Dés"><div class="die" v-for="i in diceCount" :key="i" :aria-label="`Dé ${i} : ${values[i-1] ?? 'en attente'}`">{{ values[i-1] ?? '·' }}</div></div>
   <p class="dice-result" role="status">{{ rolling ? 'Les dés sont lancés…' : values.length ? `${values.join(' + ')} = ${total}` : 'Le hasard n’attend que toi.' }}</p>
   <button class="roll-button" @click="roll" :disabled="rolling">{{ rolling ? 'Lancer en cours…' : 'Lancer les dés' }} <ArrowUpRight aria-hidden="true" /></button>
  </section><footer><p>De 1 à 4 dés, avec 1 à 20 faces chacun. Chaque lancer est indépendant.</p></footer>
 </div>
</template>
<style scoped>
.setting{display:flex;flex-direction:column;gap:9px;font-size:14px;color:var(--muted)}.stepper{display:flex;align-items:center;gap:4px;padding:3px;border:1px solid var(--border);border-radius:7px;background:var(--bg)}.stepper button{padding:4px;width:32px;height:32px;background:var(--panel);color:var(--text);border:0;font-size:20px}.stepper output{width:46px;text-align:center;font:17px var(--mono);color:var(--text)}.dice-tray{display:flex;justify-content:center;flex-wrap:wrap;gap:20px;padding:56px 0 34px}.die{display:grid;place-items:center;width:90px;height:90px;background:#24272b;border:1px solid #454950;border-bottom:5px solid #121416;border-radius:15px;font:36px var(--mono);color:#edf0f4;box-shadow:0 7px 14px #0002}.rolling .die{animation:toss .2s ease-in-out infinite alternate}.dice-result{text-align:center;min-height:26px;margin-bottom:28px;font:16px var(--mono);color:var(--muted)}.roll-button{display:flex;align-items:center;justify-content:center;gap:30px;min-width:210px;margin:auto}.dice-panel{padding-bottom:32px!important}@keyframes toss{from{transform:translateY(-5px) rotate(-5deg)}to{transform:translateY(3px) rotate(5deg)}}@media(max-width:600px){.dice-tray{gap:12px;padding:40px 0 28px}.die{width:65px;height:65px;font-size:28px}.setting{flex:1}.stepper{justify-content:space-between}.roll-button{width:100%}}
</style>
