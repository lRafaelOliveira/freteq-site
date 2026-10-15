import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../public', import.meta.url))
const PORT = Number(process.env.PORT ?? 4321)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

const LEGACY_REDIRECTS = {
  '/index.html': '/',
  '/cotacao.html': '/calcular-frete/',
  '/rastreamento.html': '/rastreamento/',
  '/cadastro-seller.html': 'https://app.freteq.com.br/cadastro',
}

async function resolveFile(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  let file = join(ROOT, safe)
  try {
    const info = await stat(file)
    if (info.isDirectory()) file = join(file, 'index.html')
    await stat(file)
    return file
  } catch {
    return null
  }
}

createServer(async (req, res) => {
  const urlPath = new URL(req.url ?? '/', 'http://localhost').pathname
  const redirect = LEGACY_REDIRECTS[urlPath]
  if (redirect) {
    res.writeHead(301, { Location: redirect })
    res.end()
    return
  }
  if (!urlPath.endsWith('/') && !extname(urlPath)) {
    res.writeHead(301, { Location: `${urlPath}/` })
    res.end()
    return
  }

  const file = await resolveFile(urlPath)
  if (!file) {
    res.writeHead(404, { 'Content-Type': MIME['.html'] })
    res.end(await readFile(join(ROOT, '404.html')))
    return
  }
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' })
  res.end(await readFile(file))
}).listen(PORT, () => {
  console.log(`FreteQ site em http://localhost:${PORT}`)
})
