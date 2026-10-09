import { chromium, expect } from '@playwright/test'
const origin=process.env.TEST_URL || 'http://127.0.0.1:8087'
const browser=await chromium.launch()
const page=await browser.newPage({viewport:{width:390,height:844}})
const errors=[]
page.on('pageerror',e=>errors.push(e.message))
try {
 for(const route of ['/','/play/typing/','/play/roll-dice/','/play/morpion/','/play/snake/','/mentions-legales/','/confidentialite/']) {
  const response=await page.goto(origin+route)
  expect(response.status()).toBe(200)
  await expect(page.locator('h1')).toBeVisible()
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
 }
 await page.goto(origin+'/play/morpion/')
 await page.locator('.tic-board button').first().click()
 await expect(page.locator('.tic-board button:disabled')).toHaveCount(2)
 await page.goto(origin+'/play/roll-dice/')
 await page.getByRole('button',{name:'Lancer les dés',exact:true}).click()
 await expect(page.locator('.dice-result')).toContainText('=')
 await page.goto(origin+'/play/snake/')
 await page.getByRole('button',{name:'Jouer',exact:true}).click()
 await page.getByRole('button',{name:'Pause',exact:true}).click()
 await expect(page.locator('.snake-overlay')).toBeVisible()
 await page.goto(origin+'/play/typing/')
 await page.locator('#typing').fill('bonjour')
 await page.locator('#typing').press('Space')
 await expect(page.locator('#typing')).toHaveValue('')
 await page.goto(origin+'/#/play/snake')
 await expect(page).toHaveURL(origin+'/play/snake/')
 expect((await page.goto(origin+'/inconnue/')).status()).toBe(404)
 await expect(page.locator('h1')).toContainText('n’existe pas')
 expect(errors).toEqual([])
 console.log('7 pages, mobile sans débordement, 4 jeux, ancien lien et vraie 404 : OK')
} finally {await browser.close()}
