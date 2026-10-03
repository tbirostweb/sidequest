import test from 'node:test'
import assert from 'node:assert/strict'
import {initialState,step,foodFor,SIZE} from './engine.js'
const running=()=>({...initialState(),status:'running'})
test('advances and refuses instant reverse',()=>{const s=step(running(),'left');assert.deepEqual(s.snake[0],{x:9,y:10});assert.equal(s.snake.length,3)})
test('eating increases length and score with food outside the body',()=>{const s=running();s.food={x:9,y:10};const n=step(s,'right',()=>0);assert.equal(n.score,10);assert.equal(n.snake.length,4);assert.ok(!n.snake.some(p=>p.x===n.food.x&&p.y===n.food.y))})
test('walls and self collision end the game',()=>{const s=running();s.snake=[{x:19,y:4},{x:18,y:4}];assert.equal(step(s).status,'over');s.snake=[{x:3,y:3},{x:3,y:4},{x:4,y:4},{x:4,y:3},{x:4,y:2}];assert.equal(step(s,'right').status,'over')})
test('moving into the departing tail is legal and pauses do not advance',()=>{const s=running();s.snake=[{x:3,y:3},{x:3,y:4},{x:4,y:4},{x:4,y:3}];assert.equal(step(s,'right').status,'running');s.status='paused';assert.equal(step(s),s)})
test('filling the final cell wins',()=>{const cells=[];for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++)cells.push({x,y});const s=running();s.snake=[{x:0,y:0},...cells.filter(p=>!(p.y===0&&(p.x===0||p.x===1)))];s.food={x:1,y:0};assert.equal(step(s,'right').status,'won');assert.equal(foodFor(cells),null)})
