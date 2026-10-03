import fs from 'node:fs'
import path from 'node:path'
const excluded = new Set(['node_modules','dist','.git','.idea','.env'])
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp3':'audio/mpeg','.woff2':'font/woff2'}
export function gamesPlugin(){
 let root,folder
 function catalog(){
  const ids=new Set()
  return fs.readdirSync(folder,{withFileTypes:true}).filter(d=>d.isDirectory()&&!d.name.startsWith('.')).flatMap(d=>{
   const base=path.join(folder,d.name),vue=fs.existsSync(path.join(base,'Game.vue')),html=fs.existsSync(path.join(base,'index.html'))
   if(!vue&&!html)return []
   const meta=fs.existsSync(path.join(base,'game.json'))?JSON.parse(fs.readFileSync(path.join(base,'game.json'),'utf8')):{}
   const id=meta.id||d.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')
   if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)||ids.has(id))throw new Error(`Identifiant de jeu invalide ou dupliqué : ${id}`)
   ids.add(id)
   return [{title:d.name,category:'Arcade',description:'Un nouveau jeu à découvrir.',shortDescription:'À toi de jouer.',duration:'À volonté',art:'dice',color:'violet',tag:'MINI-JEU',...meta,id,folder:d.name,type:vue?'vue':'html',url:`/mini-games/${encodeURIComponent(d.name)}/index.html`,componentKey:`../games/${d.name}/Game.vue`}]
  }).sort((a,b)=>Number(!!b.featured)-Number(!!a.featured)||a.title.localeCompare(b.title))
 }
 return {name:'mini-games',configResolved(config){root=config.root;folder=path.join(root,'games')},resolveId(id){if(id==='virtual:games')return '\0virtual:games'},load(id){if(id==='\0virtual:games')return `export default ${JSON.stringify(catalog())}`},configureServer(server){
  server.watcher.add(folder)
  server.watcher.on('all',(event,file)=>{if(file.startsWith(folder)&&(/game\.json$/.test(file)||(['add','unlink','addDir','unlinkDir'].includes(event)&&/(Game\.vue|index\.html)$/.test(file)))){const mod=server.moduleGraph.getModuleById('\0virtual:games');if(mod)server.moduleGraph.invalidateModule(mod);server.ws.send({type:'full-reload'})}})
  server.middlewares.use('/mini-games/',(req,res,next)=>{try{const relative=decodeURIComponent((req.url||'').split('?')[0]),pieces=relative.split('/').filter(Boolean);if(pieces.some(s=>s.startsWith('.')||excluded.has(s))) {res.statusCode=403;res.end();return}const target=path.resolve(folder,...pieces);if(!target.startsWith(folder+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile())return next();const real=fs.realpathSync(target);if(!real.startsWith(folder+path.sep)){res.statusCode=403;res.end();return}res.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');fs.createReadStream(target).pipe(res)}catch{res.statusCode=400;res.end()}})
 },writeBundle(options){for(const game of catalog().filter(g=>g.type==='html'))fs.cpSync(path.join(folder,game.folder),path.join(options.dir,'mini-games',game.folder),{recursive:true,filter:source=>!path.relative(path.join(folder,game.folder),source).split(path.sep).some(p=>p.startsWith('.')||excluded.has(p))})}}
}
