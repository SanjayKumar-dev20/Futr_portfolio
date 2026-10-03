import { build } from 'vite'
import { copyFile, readFile, writeFile } from 'node:fs/promises'

const base = '/Futr_portfolio/'
const pageUrl = `https://SanjayKumar-dev20.github.io${base}`

await build({ base })

for (const file of ['index.html', 'robots.txt', 'sitemap.xml']) {
  const path = new URL(`../dist/${file}`, import.meta.url)
  const content = await readFile(path, 'utf8')
  await writeFile(path, content.replaceAll('https://futrmarkets.com/', pageUrl))
}

await copyFile(new URL('../dist/index.html', import.meta.url), new URL('../dist/404.html', import.meta.url))
await writeFile(new URL('../dist/.nojekyll', import.meta.url), '')
