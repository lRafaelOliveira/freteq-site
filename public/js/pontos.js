import { config } from './config.js'

const form = document.getElementById('pontos-form')
const results = document.getElementById('pontos-results')
const cepInput = document.getElementById('pontos-cep')
const submitBtn = document.getElementById('pontos-submit')

const LOGGI_LOCATOR = 'https://www.loggi.com/loggipontos/'
const JT_LOCATOR = 'https://www.jtexpress.com.br/mobile/networkQuery'
const MAX_POINTS = 3

const FRETEQ_HUB = {
  name: 'Unidade Taguatinga Norte',
  subtitle: 'Central FreteQ · Latam Cargo',
  addressHtml: 'QNG 27 Lote 02 Loja 03<br>Taguatinga Norte - DF, 72130-370',
  hours: 'Seg à Sex: 08h - 18h | Sáb: 09h - 13h',
  mapsUrl: config.MAPS_URL,
}

if (cepInput) {
  cepInput.addEventListener('input', () => {
    const d = onlyDigits(cepInput.value).slice(0, 8)
    cepInput.value = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
  })
}

function onlyDigits(value) {
  return String(value).replace(/\D/g, '')
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatDistance(km) {
  if (km == null || Number.isNaN(Number(km))) return ''
  return `${Number(km).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`
}

function formatAddress(point) {
  const street = [point.street, point.number, point.complement].filter(Boolean).join(', ')
  const city = [point.district, [point.city, point.state].filter(Boolean).join('/')].filter(Boolean).join(' · ')
  return [street, city].filter(Boolean).join(' — ')
}

function formatHours(point) {
  if (point.hours) return point.hours
  if (point.weekdayHours && point.weekendHours) {
    return `Semana ${point.weekdayHours} · Sábado ${point.weekendHours}`
  }
  return point.weekdayHours || ''
}

function mapsUrl(point) {
  if (point.lat != null && point.lng != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress(point) || point.name)}`
}

function hubCard() {
  return `
    <article class="bg-white p-6 rounded-3xl shadow-xl text-left">
      <p class="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">${escapeHtml(FRETEQ_HUB.subtitle)}</p>
      <h3 class="text-xl font-black text-gray-900 mb-2">${escapeHtml(FRETEQ_HUB.name)}</h3>
      <p class="text-gray-600 font-medium mb-4">${FRETEQ_HUB.addressHtml}</p>
      <p class="text-sm text-gray-500 mb-5">${escapeHtml(FRETEQ_HUB.hours)}</p>
      <a href="${FRETEQ_HUB.mapsUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex w-full justify-center bg-black text-white px-6 py-3 rounded-xl font-black hover:bg-gray-800 transition">Abrir no mapa</a>
    </article>`
}

function displayName(name) {
  const cleaned = String(name ?? '').replace(/^yoyi!\s*/i, '').trim()
  return cleaned || String(name ?? '')
}

function pointItem(point) {
  const distance = formatDistance(point.distanceKm)
  const address = formatAddress(point)
  const hours = formatHours(point)
  return `
    <li class="border border-gray-100 rounded-2xl p-4">
      <div class="flex items-start justify-between gap-3">
        <p class="font-bold text-gray-900 leading-snug">${escapeHtml(displayName(point.name))}</p>
        ${distance ? `<span class="shrink-0 text-xs font-black tabular-nums text-yellow-600">${escapeHtml(distance)}</span>` : ''}
      </div>
      ${address ? `<p class="text-sm text-gray-600 mt-1">${escapeHtml(address)}</p>` : ''}
      ${hours ? `<p class="text-xs text-gray-500 mt-1">${escapeHtml(hours)}</p>` : ''}
      <a href="${mapsUrl(point)}" target="_blank" rel="noopener noreferrer" class="inline-block mt-2 text-sm font-bold text-black underline underline-offset-2">Como chegar</a>
    </li>`
}

function carrierCard(title, emptyMessage, locatorUrl, locatorLabel, points) {
  const list = Array.isArray(points) ? points.slice(0, MAX_POINTS) : []
  const body =
    list.length > 0
      ? `<ul class="space-y-3">${list.map(pointItem).join('')}</ul>`
      : `<p class="text-gray-600 font-medium">${escapeHtml(emptyMessage)}</p>`
  return `
    <article class="bg-white p-6 rounded-3xl shadow-xl text-left flex flex-col">
      <p class="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">${escapeHtml(title)}</p>
      <div class="flex-1">${body}</div>
      <a href="${escapeHtml(locatorUrl)}" target="_blank" rel="noopener noreferrer" class="mt-5 inline-flex w-full justify-center border-2 border-black text-black px-6 py-3 rounded-xl font-black hover:bg-black hover:text-white transition">${escapeHtml(locatorLabel)}</a>
    </article>`
}

function renderLoading() {
  results.innerHTML = `
    <div class="flex flex-col items-center py-10 bg-white/60 rounded-3xl">
      <div class="loader mb-4"></div>
      <p class="font-bold text-gray-700 animate-pulse">Buscando os pontos mais próximos...</p>
    </div>`
}

function findCarrier(carriers, slug) {
  return (carriers ?? []).find((c) => c.slug === slug) ?? null
}

function jtLocator(cep) {
  return cep.length === 8 ? `${JT_LOCATOR}?zipCode=${cep}` : JT_LOCATOR
}

function renderResults(payload, cep) {
  const loggi = findCarrier(payload?.carriers, 'loggi')
  const jt = findCarrier(payload?.carriers, 'jtexpress')
  results.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      ${hubCard()}
      ${carrierCard(
        'Loggi',
        'Não encontramos LoggiPonto para este CEP. Abra o localizador da Loggi.',
        loggi?.locatorUrl || LOGGI_LOCATOR,
        'Ver no site da Loggi',
        loggi?.points,
      )}
      ${carrierCard(
        'J&T',
        'Não encontramos unidade J&T para este CEP. Abra o localizador da J&T.',
        jt?.locatorUrl || jtLocator(cep),
        'Ver no site da J&T',
        jt?.points,
      )}
    </div>`
}

function renderFallback(cep) {
  results.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      ${hubCard()}
      ${carrierCard('Loggi', 'Não foi possível listar agora. Abra o localizador da Loggi para ver os pontos perto de você.', LOGGI_LOCATOR, 'Ver no site da Loggi', [])}
      ${carrierCard('J&T', 'Não foi possível listar agora. Abra o localizador da J&T para ver as unidades perto de você.', jtLocator(cep), 'Ver no site da J&T', [])}
    </div>`
}

if (form && results) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const cep = onlyDigits(cepInput.value)
    if (cep.length !== 8) {
      cepInput.focus()
      return
    }
    submitBtn.disabled = true
    renderLoading()
    try {
      const res = await fetch(`${config.API_BASE_URL}/public/dropoff-points?cep=${cep}`)
      if (!res.ok) throw new Error('bad_status')
      const payload = await res.json()
      renderResults(payload, cep)
    } catch {
      renderFallback(cep)
    } finally {
      submitBtn.disabled = false
    }
  })
}
