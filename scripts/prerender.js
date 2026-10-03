import fs from 'node:fs/promises'
import path from 'node:path'
import { createServer } from 'vite'
import { ORIGIN } from '../src/seo.js'
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}})
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')
try{
 const {routes,render}=await server.ssrLoadModule('/src/entry-server.js')
 const shell=await fs.readFile('dist/index.html','utf8')
 for(const route of routes){
  const {html,meta}=await render(route)
  const url=ORIGIN+meta.path
  const head=`<title>${escape(meta.title)}</title><meta name="description" content="${escape(meta.description)}"><meta name="robots" content="${meta.noindex?'noindex, follow':'index, follow'}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="Sidequest"><meta property="og:locale" content="fr_FR"><meta property="og:title" content="${escape(meta.title)}"><meta property="og:description" content="${escape(meta.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${ORIGIN}/images/sidequest-social.webp"><meta property="og:image:alt" content="Robot rétrofuturiste sous un ciel turquoise — Sidequest"><meta name="twitter:card" content="summary_large_image">`
  const out=route==='/404.html'?'dist/404.html':path.join('dist',route,'index.html')
  await fs.mkdir(path.dirname(out),{recursive:true})
  await fs.writeFile(out,shell.replace('<!--seo-->',head).replace('<div id="app"></div>',`<div id="app">${html}</div>`))
 }
 const urls=routes.filter(r=>r!=='/404.html').map(r=>`<url><loc>${ORIGIN}${r}</loc></url>`).join('')
 await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`)
 await fs.writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nDisallow: /health\nSitemap: ${ORIGIN}/sitemap.xml\n`)
 console.log(`Prerender: ${routes.length} pages, robots.txt and sitemap.xml`)
}finally{await server.close()}
