import test from 'node:test'
import assert from 'node:assert/strict'
import { generateWords, statistics } from './engine.js'
test('generates both languages without consecutive duplicates', () => {
 for (const lang of ['fr','en']) { const words = generateWords(lang); assert.equal(words.length,350); assert.ok(words.every((word,i) => word && word !== words[i-1])) }
})
test('standard five-character speed includes correct separators', () => { const s = statistics(['hello'],['hello'],'',60); assert.equal(s.correctChars,6); assert.equal(s.wpm,1); assert.equal(s.accuracy,100); assert.equal(s.correctWords,1) })
test('missing and extra characters penalize accuracy', () => { assert.equal(statistics(['ca'],['cat'],'',60).accuracy,50); assert.equal(statistics(['cats'],['cat'],'',60).accuracy,60) })
test('unfinished word counts characters but not completed words', () => { const s = statistics([],['bonjour'],'bon',30); assert.equal(s.correctChars,3); assert.equal(s.correctWords,0); assert.equal(s.wpm,1) })
test('idle has no speed and safe accuracy', () => { assert.equal(statistics([],[],'',0).wpm,0); assert.equal(statistics([],[],'',0).accuracy,100) })
