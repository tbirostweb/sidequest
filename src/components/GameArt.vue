<script setup>
import { Keyboard, Dice5, Dice3, ArrowUpRight, X, Circle, Waypoints } from '@lucide/vue'
defineProps({kind:String})
</script>
<template>
 <div class="game-art" :class="kind" aria-hidden="true">
  <template v-if="kind==='keyboard'"><div class="art-grid"></div><div class="type-lines"><span>SHIFT YOUR</span><span>PACE<span class="outline-type">_</span></span></div><div class="keyboard-sculpture"><Keyboard :stroke-width=".75"/><span>FR / EN</span></div><div class="mint-orbit"><ArrowUpRight :stroke-width="1.5"/></div><div class="art-sticker">100%<br>FOCUS</div></template>
  <template v-else-if="kind==='morpion'"><div class="morpion-art"><span v-for="(cell,i) in ['X','O','X','','X','O','O','','X']" :key="i"><component v-if="cell" :is="cell==='X'?X:Circle"/></span></div><span class="board-caption">MAKE<br>YOUR MOVE.</span></template>
  <template v-else-if="kind==='snake'"><div class="snake-art-grid"></div><div class="snake-art-body"><span v-for="i in 8" :key="i" :style="{left: `${(i<5?i:4)*35}px`,top:`${i<5?0:(i-4)*35}px`}"></span></div><span class="snake-art-food"></span><span class="board-caption">STAY<br>IN THE GAME.</span></template>
  <template v-else><div class="dice-rings"></div><span class="giant-outline">LUCK</span><div class="dice-sculpture dice-back"><Dice3 :stroke-width="1.1"/></div><div class="dice-sculpture dice-front"><Dice5 :stroke-width="1.1"/></div><span class="orange-disc"></span><span class="dice-code">RANDOM IS<br>THE NEW RULE.</span></template>
 </div>
</template>
