export const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
export function outcome(board){const line=lines.find(l=>board[l[0]]&&l.every(i=>board[i]===board[l[0]]));return line?{winner:board[line[0]],line}:board.every(Boolean)?{winner:'draw',line:[]}:null}
export function computerMove(board){
 function search(b,turn,depth){const result=outcome(b);if(result)return result.winner==='O'?10-depth:result.winner==='X'?depth-10:0;const scores=[];for(let i=0;i<9;i++)if(!b[i]){const next=[...b];next[i]=turn;scores.push(search(next,turn==='O'?'X':'O',depth+1))}return turn==='O'?Math.max(...scores):Math.min(...scores)}
 if(outcome(board))return -1
 let best=-Infinity,choice=-1
 for(const i of [4,0,2,6,8,1,3,5,7])if(!board[i]){const next=[...board];next[i]='O';const score=search(next,'X',0);if(score>best){best=score;choice=i}}
 return choice
}
