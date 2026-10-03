import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import catalog from 'virtual:games'
import { pageMetadata } from './seo.js'
export const routes = ['/', ...catalog.map(g=>`/play/${g.id}/`), '/mentions-legales/', '/confidentialite/', '/404.html']
export async function render(path) { return { html: await renderToString(createSSRApp(App,{initialPath:path})), meta:pageMetadata(path,catalog) } }
