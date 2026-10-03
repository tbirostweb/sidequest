<script setup>
import { computed, ref, onUnmounted, nextTick, watch } from 'vue'
import { RotateCcw, CornerDownLeft, Delete } from '@lucide/vue'
import { generateWords, statistics } from './engine.js'
const language = ref('fr'), duration = ref(60), state = ref('ready')
const words = ref(generateWords('fr')), answers = ref([]), input = ref(''), elapsed = ref(0), field = ref(null)
let startedAt = 0, timer
const labels = {
fr: {title:'Test de certification de dactylographie', intro:'Mesurez votre vitesse et votre précision.', language:'Langue du test', duration:'Durée', seconds:'secondes', remaining:'Temps restant', speed:'Mots / min', accuracy:'Précision', ready:'Prêt à écrire ?', instruction:'Le chronomètre démarre à la première lettre. Validez chaque mot avec Espace ou Entrée. Respectez les accents.', running:'Test en cours', placeholder:'Tapez le mot surligné…', restart:'Recommencer', done:'Test terminé', correct:'Mots corrects', incorrect:'Mots incorrects', again:'Faire un nouveau test', note:'Résultat indicatif : ce test ne délivre pas de certification officielle.', calculation:'Vitesse : caractères corrects ÷ 5, ramenés à une minute. La précision tient compte des caractères erronés et manquants.', focus:'Cliquez dans le champ pour continuer.', result:'Votre résultat'},
en: {title:'Typing certification test', intro:'Measure your typing speed and accuracy.', language:'Test language', duration:'Duration', seconds:'seconds', remaining:'Time left', speed:'Words / min', accuracy:'Accuracy', ready:'Ready to type?', instruction:'The timer starts with your first letter. Submit each word with Space or Enter. Match every character.', running:'Test in progress', placeholder:'Type the highlighted word…', restart:'Restart', done:'Test complete', correct:'Correct words', incorrect:'Incorrect words', again:'Take another test', note:'Practice result: this test does not provide official certification.', calculation:'Speed: correct characters ÷ 5, scaled to one minute. Accuracy includes incorrect and missing characters.', focus:'Click the input to continue.', result:'Your result'} }
const t = computed(() => labels[language.value])
const remaining = computed(() => Math.max(0, Math.ceil(duration.value - elapsed.value)))
const stats = computed(() => statistics(answers.value, words.value, input.value, elapsed.value))
const visibleWords = computed(() => { const start = Math.floor(answers.value.length / 15) * 15; return words.value.slice(start, start + 30).map((word, i) => ({word, index:start + i})) })
function finish() { clearInterval(timer); elapsed.value = duration.value; state.value = 'finished' }
function tick() { if (state.value !== 'running') return; elapsed.value = Math.min(duration.value, (performance.now() - startedAt) / 1000); if (elapsed.value >= duration.value) finish() }
function start() { state.value = 'running'; startedAt = performance.now(); timer = setInterval(tick, 50) }
function changeInput(event) {
  if (state.value === 'finished') return
  if (state.value === 'running') tick()
  if (state.value === 'finished') return
  const value = event.target.value.normalize('NFC').replace(/\s/g, '')
  if (value && state.value === 'ready') start()
  input.value = value
  event.target.value = value
}
function submit(event) {
  if (event.isComposing || ![' ', 'Enter'].includes(event.key)) return
  event.preventDefault(); tick()
  if (state.value !== 'running' || !input.value) return
  answers.value.push(input.value); input.value = ''
  if (words.value.length - answers.value.length < 40) words.value.push(...generateWords(language.value, 150))
}
function reset(focus = true) {
  clearInterval(timer); state.value = 'ready'; elapsed.value = 0; answers.value = []; input.value = ''; words.value = generateWords(language.value)
  if (focus) nextTick(() => field.value?.focus())
}
watch([language, duration], () => { document.documentElement.lang = language.value; document.title = t.value.title; reset(false) })
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="typing-game game-ui" :class="{ playing: state === 'running' }">

    <header class="game-header"><span class="eyebrow">{{ language === 'fr' ? '// À VOUS DE JOUER' : '// YOUR TURN' }}</span><h1>{{ t.title }}</h1><p>{{ t.intro }}</p></header>
    <section class="settings" aria-label="Configuration">
      <label>{{ t.language }}<select v-model="language" :disabled="state === 'running'"><option value="fr">Français</option><option value="en">English</option></select></label>
      <label>{{ t.duration }}<select v-model.number="duration" :disabled="state === 'running'"><option v-for="n in [30,60,120]" :key="n" :value="n">{{ n }} {{ t.seconds }}</option></select></label>
      <button class="secondary" @click="reset()"><RotateCcw aria-hidden="true" /> {{ t.restart }}</button>
    </section>
    <section class="stats" aria-label="Statistiques">
      <div><span>{{ t.remaining }}</span><strong>{{ remaining }}<small>s</small></strong></div>
      <div><span>{{ t.speed }}</span><strong>{{ stats.wpm }}</strong></div>
      <div><span>{{ t.accuracy }}</span><strong>{{ stats.accuracy }}<small>%</small></strong></div>
    </section>
    <div class="progress" role="progressbar" :aria-label="t.remaining" :aria-valuenow="remaining" :aria-valuemin="0" :aria-valuemax="duration"><div :style="{width: `${remaining / duration * 100}%`}"></div></div>
    <section v-if="state !== 'finished'" class="test">
      <div class="test-heading"><h2><span class="status-dot" aria-hidden="true"></span>{{ state === 'ready' ? t.ready : t.running }}</h2><span class="terminal-label" aria-hidden="true">{{ language.toUpperCase() }} / {{ duration }}S</span></div><p class="instruction">{{ t.instruction }}</p>
      <div class="words" aria-hidden="true"><span v-for="item in visibleWords" :key="item.index" :class="{active:item.index === answers.length, correct:item.index < answers.length && answers[item.index] === item.word, wrong:item.index < answers.length && answers[item.index] !== item.word}"><template v-if="item.index === answers.length"><span v-for="(char, i) in item.word" :key="i" :class="{hit: input[i] === char, miss: input[i] !== undefined && input[i] !== char}">{{ char }}</span><span class="miss" v-if="input.length > item.word.length">{{ input.slice(item.word.length) }}</span></template><template v-else>{{ item.word }}</template></span></div>
      <label class="input-label" for="typing">{{ words[answers.length] }}</label>
      <input id="typing" ref="field" :value="input" @input="changeInput" @keydown="submit" @paste.prevent @drop.prevent :placeholder="t.placeholder" autocomplete="off" autocapitalize="off" :spellcheck="false" autocorrect="off" :aria-label="`${t.placeholder} ${words[answers.length]}`">
      <div class="keyboard-hint"><span><kbd>{{ language === 'fr' ? 'espace' : 'space' }}</kbd> / <kbd :aria-label="language === 'fr' ? 'Entrée' : 'Enter'"><CornerDownLeft aria-hidden="true" /></kbd> {{ language === 'fr' ? 'valider le mot' : 'submit word' }}</span><span><kbd :aria-label="language === 'fr' ? 'Retour arrière' : 'Backspace'"><Delete aria-hidden="true" /></kbd> {{ language === 'fr' ? 'corriger' : 'correct' }}</span></div>
    </section>
    <section v-else class="results" aria-live="polite">
      <span class="eyebrow">{{ t.result }}</span><h2>{{ t.done }}</h2>
      <p class="score">{{ stats.wpm }} <span>{{ t.speed }}</span></p>
      <div class="summary"><p><strong>{{ stats.correctWords }}</strong> {{ t.correct }}</p><p><strong>{{ stats.incorrectWords }}</strong> {{ t.incorrect }}</p><p><strong>{{ stats.accuracy }} %</strong> {{ t.accuracy }}</p></div>
      <button @click="reset()">{{ t.again }}</button>
    </section>
    <footer><p>{{ t.calculation }}</p><p>{{ t.note }}</p></footer>
  </div>
</template>

