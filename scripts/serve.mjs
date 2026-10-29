import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../public', import.meta.url))
const PORT = Number(process.env.PORT ?? 4321)
const API_PROXY = (process.env.API_PROXY ?? 'https://backend.freteq.com.br').replace(/\/+$/, '')

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

async function proxyPublicApi(req, res) {
  const target = `${API_PROXY}${req.url ?? '/'}`
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const method = req.method ?? 'GET'
  const headers = { Accept: req.headers.accept ?? 'application/json' }
  if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type']
  const proxied = await fetch(target, {
    method,
    headers,
    body: method === 'GET' || method === 'HEAD' ? undefined : Buffer.concat(chunks),
  })
  const body = Buffer.from(await proxied.arrayBuffer())
  const contentType = proxied.headers.get('content-type') ?? 'application/json'
  res.writeHead(proxied.status, { 'Content-Type': contentType })
  res.end(body)
}

createServer(async (req, res) => {
  const urlPath = new URL(req.url ?? '/', 'http://localhost').pathname
  if (urlPath.startsWith('/public/')) {
    try {
      await proxyPublicApi(req, res)
    } catch (err) {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: { message: 'Falha ao consultar a API.' } }))
      console.error('API proxy failed:', err)
    }
    return
  }
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
