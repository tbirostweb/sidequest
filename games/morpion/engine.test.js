import test from 'node:test'
import assert from 'node:assert/strict'
import {outcome,computerMove} from './engine.js'
test('detects wins and draws',()=>{assert.equal(outcome(['X','X','X',null,null,null,null,null,null]).winner,'X');assert.equal(outcome(['X','O','X','X','O','O','O','X','X']).winner,'draw');assert.equal(outcome(Array(9).fill(null)),null)})
test('computer takes a win and blocks immediate losses',()=>{assert.equal(computerMove(['O','O',null,'X','X',null,null,null,null]),2);assert.equal(computerMove(['X','X',null,null,'O',null,null,null,null]),2)})
test('computer never loses against any legal human continuation',()=>{function visit(b){const r=outcome(b);if(r){assert.notEqual(r.winner,'X');return}for(let i=0;i<9;i++)if(!b[i]){const next=[...b];next[i]='X';if(!outcome(next)){const move=computerMove(next);assert.ok(move>=0&&!next[move]);next[move]='O'}visit(next)}}visit(Array(9).fill(null))})
