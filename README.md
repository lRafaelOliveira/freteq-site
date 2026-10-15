# FreteQ — Site institucional

Clone otimizado de [freteq.com.br](https://freteq.com.br) em HTML/CSS/JS puro, com SEO local e Core Web Vitals.

## Stack

- HTML estático (páginas geradas por `scripts/generate-pages.mjs`)
- Tailwind CSS v4 compilado (`@tailwindcss/cli`)
- JS vanilla (módulos ES)
- Nginx + Docker para deploy

## Páginas

| URL | Descrição |
| --- | --- |
| `/` | Home institucional |
| `/calcular-frete/` | Simulador → `POST /public/quotes` |
| `/rastreamento/` | Rastreio → `GET /public/tracking/:code` |

Redirects 301: `cotacao.html` → `/calcular-frete/`, `rastreamento.html` → `/rastreamento/`.

## Desenvolvimento

```bash
cd site
npm install
npm run images          # regenera WebP a partir de .originals/ (opcional)
npm run pages           # regenera os HTML
npm run build           # CSS + HTML
npm run dev             # Tailwind watch + http://localhost:4321
```

## Configuração da API

Em [`public/js/config.js`](public/js/config.js):

- `API_BASE_URL` → `https://backend.freteq.com.br`
- `APP_URL` → `https://app.freteq.com.br`

### CORS no backend

O backend libera origens listadas em `FRONTEND_URL` (vírgula-separado). Em produção, use:

```env
FRONTEND_URL=https://app.freteq.com.br,https://freteq.com.br,https://www.freteq.com.br
```

O primeiro item continua sendo a URL do painel (`frontendUrl` no código).

## Deploy (Coolify)

Passo a passo completo: **[DEPLOY.md](DEPLOY.md)** (Dockerfile no Coolify ou GHCR + webhook).

```bash
docker build -t freteq-site .
docker run --rm -p 8080:80 freteq-site
```

## SEO (pós-deploy)

1. Google Search Console → verificar domínio → enviar `https://freteq.com.br/sitemap.xml`
2. Google Business Profile da unidade (QNG 27, Taguatinga Norte)
3. Conferir Instagram e link do Maps em `scripts/layout.mjs` / `public/js/config.js`
