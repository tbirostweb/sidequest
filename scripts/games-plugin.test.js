import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { gamesPlugin } from './games-plugin.js'
function fixture(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'sidequest-test-'));fs.mkdirSync(path.join(root,'games'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));return root}
function add(root,name,files){const folder=path.join(root,'games',name);fs.mkdirSync(folder,{recursive:true});for(const [file,body] of Object.entries(files)){fs.mkdirSync(path.dirname(path.join(folder,file)),{recursive:true});fs.writeFileSync(path.join(folder,file),body)}}
function plugin(root){const p=gamesPlugin();p.configResolved({root});return p}
function list(p){return JSON.parse(p.load('\0virtual:games').replace('export default ',''))}
test('discovers standalone HTML without a manifest and Vue with metadata',t=>{const root=fixture(t);add(root,'New Game',{'index.html':'<h1>Play</h1>'});add(root,'typing',{'Game.vue':'<template>Type</template>','game.json':JSON.stringify({id:'typing',title:'Type Rush',featured:true})});add(root,'notes',{'README.md':'not a game'});const games=list(plugin(root));assert.equal(games.length,2);assert.equal(games[0].title,'Type Rush');assert.equal(games[0].type,'vue');assert.equal(games[1].url,'/mini-games/New%20Game/index.html');assert.equal(games[1].id,'new-game')})
test('build includes standalone assets and excludes hidden files and dependencies',t=>{const root=fixture(t);add(root,'dice',{'index.html':'<link href="assets/style.css">','assets/style.css':'body{}','.env':'secret','node_modules/unused.js':'unused'});const p=plugin(root);const out=path.join(root,'dist');p.writeBundle({dir:out});assert.ok(fs.existsSync(path.join(out,'mini-games/dice/assets/style.css')));assert.ok(!fs.existsSync(path.join(out,'mini-games/dice/.env')));assert.ok(!fs.existsSync(path.join(out,'mini-games/dice/node_modules')))})
test('rejects duplicate game routes instead of silently hiding one game',t=>{const root=fixture(t);for(const name of ['one','two'])add(root,name,{'index.html':'play','game.json':'{"id":"duplicate"}'});assert.throws(()=>list(plugin(root)),/dupliqué/)})
