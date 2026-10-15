import { config } from './config.js'

const form = document.getElementById('quote-form')
const results = document.getElementById('quote-results')
const unavailable = document.getElementById('quote-unavailable')
const submitBtn = document.getElementById('quote-submit')

function onlyDigits(value) {
  return String(value).replace(/\D/g, '')
}

function maskCep(input) {
  input.addEventListener('input', () => {
    const d = onlyDigits(input.value).slice(0, 8)
    input.value = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
  })
}

function showLoader() {
  results.innerHTML =
    '<div class="flex flex-col items-center py-8"><div class="loader mb-4"></div><p class="font-bold text-gray-400 animate-pulse text-sm">Buscando as melhores opções...</p></div>'
}

function showError(message) {
  results.innerHTML = `<div class="text-center p-6 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-medium">${message}</div>`
}

function formatBRL(cents) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function displayResults(payload) {
  const list = Array.isArray(payload?.results) ? payload.results : []
  if (list.length === 0) {
    results.innerHTML =
      '<p class="text-center text-gray-500 font-medium">Nenhuma opção de envio encontrada para estes dados. Tente outras dimensões ou fale conosco.</p>'
    return
  }
  const cards = list
    .map((option, index) => {
      const badge =
        index === 0
          ? '<span class="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded">MELHOR PREÇO</span>'
          : '<span class="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded">OPÇÃO</span>'
      const days = option.deadlineDays ?? '—'
      const name = option.serviceName || option.service || option.carrierName || 'Serviço'
      const carrier = option.carrierName ? `<p class="text-xs text-gray-500 mt-1">${option.carrierName}</p>` : ''
      return `
        <article class="border-2 border-gray-100 p-5 md:p-6 rounded-2xl bg-white hover:border-yellow-400 transition-colors">
          <div class="flex justify-between items-start mb-3 gap-2">
            <div>
              <h3 class="font-black text-gray-900 uppercase text-sm md:text-base">${escapeHtml(name)}</h3>
              ${carrier}
            </div>
            ${badge}
          </div>
          <p class="text-3xl font-black text-yellow-500 mb-1">${formatBRL(option.priceCents)}</p>
          <p class="text-xs text-gray-500 font-bold uppercase">Prazo: <span class="text-gray-900">${days} dias úteis</span></p>
        </article>`
    })
    .join('')
  results.innerHTML = `
    <div class="mb-4 text-center text-sm text-gray-500">${list.length} opção(ões) encontrada(s)</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${cards}</div>
    <div class="mt-8 text-center">
      <a href="${config.APP_URL}/cadastro" class="inline-block bg-black text-yellow-400 font-black px-8 py-4 rounded-xl hover:bg-gray-900 transition">Emitir etiqueta no painel</a>
    </div>`
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function checkStatus() {
  try {
    const res = await fetch(`${config.API_BASE_URL}/public/quotes/status`)
    if (!res.ok) return
    const data = await res.json()
    if (data.enabled === false) {
      unavailable?.classList.remove('hidden')
      form?.classList.add('hidden')
    }
  } catch {
    // Offline / CORS in local preview — keep form visible
  }
}

async function onSubmit(event) {
  event.preventDefault()
  showLoader()
  submitBtn.disabled = true

  const body = {
    originCep: onlyDigits(document.getElementById('cepOrigem').value),
    destCep: onlyDigits(document.getElementById('cepDestino').value),
    weightG: Number(document.getElementById('peso').value),
    heightCm: Number(document.getElementById('altura').value),
    widthCm: Number(document.getElementById('largura').value),
    lengthCm: Number(document.getElementById('comprimento').value),
    declaredValueCents: Math.round(Number(document.getElementById('valorDeclarado').value) * 100),
  }

  try {
    const res = await fetch(`${config.API_BASE_URL}/public/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status === 429) {
      showError('Muitas consultas em pouco tempo. Aguarde um minuto e tente novamente.')
      return
    }
    if (res.status === 503) {
      showError('Simulador indisponível no momento. Fale conosco pelo WhatsApp.')
      unavailable?.classList.remove('hidden')
      return
    }
    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(err?.error?.message || 'Erro na consulta.')
    }
    displayResults(await res.json())
  } catch (error) {
    showError(error.message || 'Não foi possível obter a cotação. Verifique os dados e tente novamente.')
  } finally {
    submitBtn.disabled = false
  }
}

if (form) {
  maskCep(document.getElementById('cepOrigem'))
  maskCep(document.getElementById('cepDestino'))
  form.addEventListener('submit', onSubmit)
  checkStatus()

  const params = new URLSearchParams(window.location.search)
  const dest = params.get('destino')
  if (dest) document.getElementById('cepDestino').value = dest
}
