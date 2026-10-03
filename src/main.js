import { createApp, createSSRApp } from 'vue'
import App from './App.vue'
import './style.css'
import './game-ui.css'
import catalog from 'virtual:games'
import { pageMetadata } from './seo.js'
document.title = pageMetadata(location.pathname,catalog).title
const root = document.getElementById('app')
const app = root.hasChildNodes() ? createSSRApp(App, { initialPath: location.pathname }) : createApp(App, { initialPath: location.pathname })
app.config.errorHandler = () => {
 root.replaceChildren()
 const box = document.createElement('main'); box.className = 'empty-state'
 const title = document.createElement('h1'); title.textContent = 'Le site n’a pas pu se charger.'
 const link = document.createElement('a'); link.href = location.pathname; link.textContent = 'Réessayer'; link.className = 'button'
 box.append(title,link);root.append(box)
}
app.mount(root)
