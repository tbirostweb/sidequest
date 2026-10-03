<script setup>
import { ref,computed,onUnmounted } from 'vue'
import { X, Circle, RotateCcw, Bot, Users } from '@lucide/vue'
import { outcome,computerMove } from './engine.js'
const mode=ref('computer'),board=ref(Array(9).fill(null)),turn=ref('X'),thinking=ref(false)
let timer
const result=computed(()=>outcome(board.value))
const status=computed(()=>result.value?result.value.winner==='draw'?'Match nul !':`${result.value.winner} remporte la partie !`:thinking.value?'L’ordinateur réfléchit…':`Au tour de ${turn.value}`)
function reset(){clearTimeout(timer);board.value=Array(9).fill(null);turn.value='X';thinking.value=false}
function play(i){if(result.value||board.value[i]||thinking.value)return;board.value[i]=turn.value;if(result.value)return;turn.value=turn.value==='X'?'O':'X';if(mode.value==='computer'&&turn.value==='O'){thinking.value=true;timer=setTimeout(()=>{const cell=computerMove(board.value);if(cell>=0)board.value[cell]='O';thinking.value=false;turn.value='X'},320)}}
onUnmounted(()=>clearTimeout(timer))
</script>
<template><div class="game-ui"><header class="game-header"><span class="eyebrow">STRATÉGIE / SOLO OU DUO</span><h1>Morpion</h1><p>Trois symboles alignés. Une seule victoire.</p></header><section class="settings"><label>Mode de jeu<select v-model="mode" @change="reset"><option value="computer">Contre l’ordinateur</option><option value="local">Deux joueurs locaux</option></select></label><button class="secondary" @click="reset"><RotateCcw/> Nouvelle partie</button></section><section class="test tic-panel"><div class="tic-status" role="status"><component :is="mode==='computer'?Bot:Users" aria-hidden="true"/><h2>{{ status }}</h2></div><p class="tic-hint">{{ mode==='computer'?'Tu joues les X. L’ordinateur joue les O.':'Jouez chacun votre tour sur le même écran.' }}</p><div class="tic-board" aria-label="Grille du morpion"><button v-for="(cell,i) in board" :key="i" :aria-label="`Ligne ${Math.floor(i/3)+1}, colonne ${i%3+1} : ${cell || 'vide'}`" :disabled="!!cell||!!result||thinking" :class="{winning:result?.line.includes(i),cross:cell==='X'}" @click="play(i)"><component v-if="cell" :is="cell==='X'?X:Circle" aria-hidden="true"/></button></div><button v-if="result" class="replay" @click="reset">Rejouer <RotateCcw/></button></section></div></template>
<style scoped>
.tic-panel{text-align:center}.tic-status{display:flex;justify-content:center;align-items:center;gap:12px}.tic-status>.lucide{color:var(--accent)}.tic-hint{font-size:14px}.tic-board{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;max-width:390px;margin:25px auto}.tic-board button{aspect-ratio:1;padding:15px;display:grid;place-items:center;background:#263a2e;border:1px solid #516756;color:#edb793}.tic-board button:disabled{opacity:1;cursor:default}.tic-board .cross{color:#89e6c2}.tic-board .winning{background:#395946;border-color:#89e6c2}.tic-board .lucide{width:65%;height:65%;stroke-width:1.5}.tic-board button:hover:not(:disabled){background:#374f3e}.replay{display:inline-flex;gap:10px;align-items:center}
</style>
