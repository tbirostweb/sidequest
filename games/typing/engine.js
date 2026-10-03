const vocabulary = {
  fr: 'le la les un une des de du et dans pour avec sans sur sous entre vers chez nous vous ils elle leur notre votre être avoir faire dire aller voir savoir pouvoir venir prendre donner trouver parler aimer penser rester passer comprendre maison jardin soleil lune étoile matin soir journée nuit temps année monde terre mer montagne rivière forêt arbre fleur feuille oiseau chat chien cheval livre histoire page lettre mot phrase langue école travail bureau clavier écran fenêtre porte table chaise ville village rue chemin voyage famille enfant ami vie cœur sourire musique lumière couleur rouge bleu vert blanc noir grand petit nouveau premier dernier beau calme rapide simple important ensemble toujours souvent parfois jamais aussi encore déjà bientôt aujourd’hui demain hier très après avant pendant pourquoi comment quand alors parce chaque tout rien quelque chose merci bonjour écrire lire apprendre écouter regarder marcher courir jouer manger boire dormir ouvrir fermer chercher commencer terminer réussir précision vitesse français été café rêve tête côté idée réponse question exercice minute seconde résultat progrès attention mémoire liberté'.split(' '),
  en: 'the a an of and in for with without on under between toward we you they she their our your be have do say go see know can come take give find speak love think stay pass understand house garden sun moon star morning evening day night time year world earth sea mountain river forest tree flower leaf bird cat dog horse book story page letter word sentence language school work office keyboard screen window door table chair city village street road journey family child friend life heart smile music light color red blue green white black big small new first last beautiful calm fast simple important together always often sometimes never also again already soon today tomorrow yesterday very after before during why how when then because each all nothing something thank hello write read learn listen watch walk run play eat drink sleep open close search begin finish succeed accuracy speed english coffee dream side idea answer question exercise minute second result progress focus memory freedom people water place good great long little right left next home help change build keep make move start stop ready practice'.split(' ')
}
export function generateWords(language, count = 350) {
  const pool = vocabulary[language] || vocabulary.fr
  const words = []
  for (let i = 0; i < count; i++) {
    let word
    do { word = pool[Math.floor(Math.random() * pool.length)] } while (word === words.at(-1))
    words.push(word)
  }
  return words
}
export function statistics(answers, words, current, seconds) {
  let correctChars = 0, totalChars = 0, correctWords = 0
  const entries = [...answers, ...(current ? [current] : [])]
  entries.forEach((entry, i) => {
    const target = words[i] || ''
    totalChars += Math.max(entry.length, i < answers.length ? target.length : 0)
    for (let c = 0; c < entry.length; c++) if (entry[c] === target[c]) correctChars++
    if (i < answers.length && entry === target) { correctWords++; correctChars++ }
    if (i < answers.length) totalChars++
  })
  return { wpm: seconds > 0 ? Math.round(correctChars / 5 / (seconds / 60)) : 0,
    accuracy: totalChars ? Math.round(correctChars / totalChars * 100) : 100,
    correctWords, incorrectWords: answers.length - correctWords, correctChars, totalChars }
}
