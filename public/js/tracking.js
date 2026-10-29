import { config } from './config.js'

const form = document.getElementById('tracking-form')
const results = document.getElementById('tracking-results')

const STATUS_LABELS = {
  pending: 'Pendente',
  created: 'Criado',
  posted: 'Postado',
  in_transit: 'Em trânsito',
  out_for_delivery: 'Saiu para entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
  exception: 'Ocorrência',
  returned: 'Devolvido',
}

function showLoader() {
  results.innerHTML = '<div class="flex justify-center py-8"><div class="loader"></div></div>'
}

function showError(message) {
  results.innerHTML = `<div class="text-center p-4 bg-red-100 text-red-700 rounded-lg">${message}</div>`
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function displayResults(payload) {
  const shipment = payload?.shipment
  const events = Array.isArray(payload?.events) ? payload.events : []
  if (!shipment && events.length === 0) {
    results.innerHTML = '<p class="text-center text-gray-500">Nenhum histórico de rastreamento encontrado.</p>'
    return
  }

  const statusKey = shipment?.status ?? events[0]?.status ?? ''
  const statusLabel = STATUS_LABELS[statusKey] || statusKey || 'Atualizando'
  const carrier = shipment?.carrierName || 'Transportadora'
  const code = shipment?.trackingCode || ''

  let html = `
    <div class="bg-gray-50 border border-gray-200 p-4 rounded-2xl mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Status Atual</h2>
      <p class="text-lg font-semibold text-yellow-600">${escapeHtml(statusLabel)}</p>
      <p class="text-sm text-gray-500 mt-1">${escapeHtml(carrier)}${code ? ` · ${escapeHtml(code)}` : ''}</p>
    </div>`

  if (events.length === 0) {
    html += '<p class="text-center text-gray-500">Ainda não há eventos de rastreamento para este código.</p>'
    results.innerHTML = html
    return
  }

  html += `<h3 class="text-2xl font-bold mb-4">Histórico Completo</h3><ol class="space-y-0">`
  events.forEach((item) => {
    const desc = item.description || STATUS_LABELS[item.status] || item.status || 'Atualização'
    const loc = item.location ? `<p class="text-sm text-gray-600">${escapeHtml(item.location)}</p>` : ''
    html += `
      <li class="border-l-2 border-yellow-500 pl-4 pb-6 relative">
        <div class="absolute -left-[11px] top-1 w-5 h-5 bg-yellow-500 rounded-full border-4 border-white" aria-hidden="true"></div>
        <p class="font-bold">${escapeHtml(desc)}</p>
        ${loc}
        <p class="text-xs text-gray-500">${escapeHtml(formatDate(item.occurredAt))}</p>
      </li>`
  })
  html += '</ol>'
  results.innerHTML = html
}

async function onSubmit(event) {
  event.preventDefault()
  const code = document.getElementById('tracking-code').value.replace(/\s+/g, '').trim()
  document.getElementById('tracking-code').value = code
  if (!code) return
  showLoader()

  // Keep shareable URL
  const url = new URL(window.location.href)
  url.searchParams.set('codigo', code)
  history.replaceState(null, '', url)

  try {
    const res = await fetch(`${config.API_BASE_URL}/public/tracking/${encodeURIComponent(code)}`, {
      headers: { Accept: 'application/json' },
    })
    if (res.status === 404) {
      showError('Código de rastreio não encontrado. Confira e tente novamente.')
      return
    }
    if (res.status === 429) {
      showError('Muitas consultas. Aguarde um minuto e tente novamente.')
      return
    }
    if (!res.ok) throw new Error('Não foi possível rastrear este código.')
    displayResults(await res.json())
  } catch (error) {
    showError(error.message || 'Erro ao consultar o rastreamento.')
  }
}

if (form) {
  form.addEventListener('submit', onSubmit)
  const params = new URLSearchParams(window.location.search)
  const code = (params.get('codigo') || params.get('code') || '').replace(/\s+/g, '').trim()
  if (code) {
    document.getElementById('tracking-code').value = code
    form.requestSubmit()
  }
}
