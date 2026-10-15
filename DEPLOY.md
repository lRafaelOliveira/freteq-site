# Deploy FreteQ Site — Coolify

Site estático (`freteq.com.br`). Repo: [lRafaelOliveira/freteq-site](https://github.com/lRafaelOliveira/freteq-site).

Há **duas formas** de subir no Coolify. A recomendada para o site é a A (Coolify builda o Dockerfile). A B espelha o painel/backend (GHCR + webhook).

---

## Pré-requisitos

1. DNS apontando para o IP da VPS (registro A):
   - `freteq.com.br`
   - `www.freteq.com.br` (opcional, mas recomendado)
2. Backend já no ar (`backend.freteq.com.br`) com cotação pública habilitada.
3. No Coolify, projeto `FreteQ` (mesmo destination do backend/painel).

---

## A) Coolify builda o Dockerfile (recomendado)

### 1. Criar a Application

Coolify → projeto FreteQ → **+ New** → **Application** → **Public Repository** (ou GitHub App):

| Campo | Valor |
| --- | --- |
| Repository | `https://github.com/lRafaelOliveira/freteq-site` |
| Branch | `main` |
| Build Pack | **Dockerfile** |
| Dockerfile Location | `/Dockerfile` |
| Port | `80` |
| Domains | `freteq.com.br`, `www.freteq.com.br` |
| Auto Deploy | **ligado** (redeploy no push em `main`) |

Health check (opcional): `GET /` → HTTP 200.

Não precisa de variáveis de ambiente: API e URLs do painel já estão em [`public/js/config.js`](public/js/config.js).

### 2. SSL

Com o domínio no Coolify, ative Let's Encrypt (HTTPS). Force HTTPS se a opção existir.

### 3. Deploy

**Deploy** no Coolify (ou push em `main` se Auto Deploy estiver ligado).

Teste:

```bash
curl -sI https://freteq.com.br/
curl -sI https://freteq.com.br/cotacao.html
# → Location: /calcular-frete/
curl -s https://freteq.com.br/sitemap.xml | head
```

---

## B) Imagem no GHCR + webhook (igual ao painel)

Use se quiser o mesmo fluxo do `freteq-frontend` / `freteq-backend`.

### 1. Application no Coolify

| Campo | Valor |
| --- | --- |
| Tipo | **Docker Image** |
| Imagem | `ghcr.io/lrafaeloliveira/freteq-site:latest` |
| Porta | `80` |
| Domains | `freteq.com.br`, `www.freteq.com.br` |
| Auto Deploy | **desligado** (o Actions dispara o webhook) |

Registry privado: na VPS ou em Coolify → Keys & Tokens, login em `ghcr.io` com PAT (`read:packages`).

### 2. Secrets no GitHub

Repo `freteq-site` → Settings → Secrets and variables → Actions:

| Secret | Onde pegar |
| --- | --- |
| `COOLIFY_WEBHOOK` | Coolify → Application do site → Webhooks → Deploy Webhook URL |
| `COOLIFY_TOKEN` | Coolify → Keys & Tokens → API token |

O workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) builda, publica no GHCR e chama o webhook em push na `main`.

---

## CORS no backend (obrigatório)

Sem isso, calculadora e rastreio falham no browser.

Coolify → Application do **backend** → Environment → `FRONTEND_URL`:

```env
FRONTEND_URL=https://app.freteq.com.br,https://freteq.com.br,https://www.freteq.com.br,http://ustqvbfjj7tahxmylaogwilm.179.199.130.225.sslip.io
```

Regras:
- Só **origem** (scheme + host), sem path (`/calcular-frete/` não entra).
- O **primeiro** item continua sendo a URL do painel (`app.freteq.com.br`).
- Inclua `http://` ou `https://` exatamente como o browser usa (sslip.io do Coolify costuma ser `http://` até o SSL do domínio próprio).
- Quando o site estiver só em `https://freteq.com.br`, pode remover o host sslip.io.

Redeploy do **backend** depois de salvar.

---

## Checklist pós-deploy

- [ ] `https://freteq.com.br/` abre a home
- [ ] `https://freteq.com.br/calcular-frete/` carrega o formulário
- [ ] Cotação chama `https://backend.freteq.com.br/public/quotes` sem erro de CORS
- [ ] `https://freteq.com.br/rastreamento/` funciona
- [ ] `cotacao.html` e `rastreamento.html` redirecionam (301)
- [ ] SSL verde em `freteq.com.br` e `www`
- [ ] `FRONTEND_URL` do backend inclui os domínios do site
- [ ] Search Console: enviar `https://freteq.com.br/sitemap.xml`

---

## Comandos locais (opcional)

```bash
cd site
docker build -t freteq-site .
docker run --rm -p 8080:80 freteq-site
# abrir http://localhost:8080
```

---

## Estrutura relevante

```
site/
├── Dockerfile          ← multi-stage: npm build + nginx
├── nginx.conf          ← gzip, cache, 301 legados, 404
├── public/             ← HTML/JS/assets servidos
└── .github/workflows/ci.yml  ← só necessário no fluxo B
```
