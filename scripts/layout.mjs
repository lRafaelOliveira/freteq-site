import { svg } from './svg.mjs'

const SITE = 'https://freteq.com.br'
const APP = 'https://app.freteq.com.br'
const WA = 'https://wa.me/5561991344563'
const MAPS = 'https://maps.google.com/?q=QNG+27+Lote+02+Loja+03,+Taguatinga+Norte+-+DF,+72130-370'
const IG = 'https://www.instagram.com/freteq/'

export function head({ title, description, path, jsonLd = [], extra = '' }) {
  const canonical = `${SITE}${path}`
  const scripts = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#facc15">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="FreteQ">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE}/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${SITE}/og-image.jpg">
  <link rel="preload" href="/assets/fonts/inter-latin-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/styles.css">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
  ${scripts.map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`).join('\n  ')}
  ${extra}
</head>`
}

export function header({ active = 'home' } = {}) {
  const link = (href, label, key) => {
    const cls = active === key ? 'text-black font-black' : 'text-black font-semibold hover:text-gray-700 transition'
    return `<a href="${href}" class="${cls}">${label}</a>`
  }
  return `
<header class="bg-yellow-400 shadow-md sticky top-0 z-50">
  <nav class="container mx-auto px-6 py-3 flex justify-between items-center" aria-label="Principal">
    <a href="/" aria-label="FreteQ — página inicial">
      <img src="/assets/img/logo-freteq-256.webp" srcset="/assets/img/logo-freteq-256.webp 256w, /assets/img/logo-freteq-512.webp 512w" sizes="(max-width:768px) 120px, 168px" width="168" height="82" alt="FreteQ — logística e envio de encomendas em Brasília" class="h-10 md:h-14 w-auto">
    </a>
    <div class="hidden lg:flex items-center space-x-8">
      ${link('/#como-funciona', 'Como Funciona', 'como')}
      ${link('/#servicos', 'Vantagens', 'servicos')}
      ${link('/#sobre-nos', 'Sobre Nós', 'sobre')}
      ${link('/#pontos', 'Pontos', 'pontos')}
      ${link('/calcular-frete/', 'Calcular Frete', 'calcular')}
      ${link('/rastreamento/', 'Rastrear', 'rastrear')}
      ${link(`${APP}/cadastro`, 'Seja Parceiro', 'parceiro')}
    </div>
    <div class="hidden lg:flex items-center space-x-4">
      <a href="${APP}/login" class="bg-white text-black font-bold px-6 py-2.5 rounded-lg border-2 border-black hover:bg-gray-100 transition">Painel</a>
    </div>
    <button id="mobile-menu-button" type="button" class="lg:hidden p-2 text-black" aria-controls="mobile-menu" aria-expanded="false" aria-label="Abrir menu">
      ${svg.menu()}
    </button>
  </nav>
  <div id="mobile-menu" class="hidden lg:hidden bg-white px-6 pb-4 border-t border-yellow-500">
    <a href="/#como-funciona" class="block py-2 text-gray-600 hover:text-yellow-500">Como Funciona</a>
    <a href="/#servicos" class="block py-2 text-gray-600 hover:text-yellow-500">Vantagens</a>
    <a href="/#sobre-nos" class="block py-2 text-gray-600 hover:text-yellow-500">Sobre Nós</a>
    <a href="/#pontos" class="block py-2 text-gray-600 hover:text-yellow-500">Pontos de Coleta</a>
    <a href="/calcular-frete/" class="block py-2 text-gray-600 hover:text-yellow-500">Calcular Frete</a>
    <a href="/rastreamento/" class="block py-2 text-gray-600 hover:text-yellow-500">Rastrear</a>
    <a href="${APP}/login" class="block py-2 text-gray-600 hover:text-yellow-500">Acessar Painel</a>
    <a href="${APP}/cadastro" class="block py-2 text-gray-600 hover:text-yellow-500">Seja Parceiro</a>
    <a href="/#contato" class="block mt-4 w-full text-center bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500">Contato</a>
  </div>
</header>`
}

export function footer() {
  return `
<footer id="contato" class="bg-black text-white py-12 md:py-16">
  <div class="container mx-auto px-6 text-center md:text-left">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10">
      <div class="flex flex-col items-center md:items-start">
        <img src="/assets/img/logo-freteq-256.webp" width="140" height="68" alt="FreteQ" class="h-14 w-auto mb-4 brightness-0 invert">
        <p class="text-gray-400 text-sm leading-relaxed text-center md:text-left">Sua solução inteligente em logística. Economia e praticidade para seus envios em Brasília e no Distrito Federal.</p>
      </div>
      <div class="flex flex-col items-center md:items-start">
        <h3 class="text-white font-bold mb-4 uppercase tracking-widest text-sm">Acesso Rápido</h3>
        <ul class="space-y-2 text-gray-400">
          <li><a href="/#servicos" class="hover:text-yellow-400 transition">Vantagens</a></li>
          <li><a href="/#pontos" class="hover:text-yellow-400 transition">Pontos de Coleta</a></li>
          <li><a href="/calcular-frete/" class="hover:text-yellow-400 transition">Calcular Frete</a></li>
          <li><a href="/rastreamento/" class="hover:text-yellow-400 transition">Rastrear Pedido</a></li>
          <li><a href="${APP}/cadastro" class="hover:text-yellow-400 transition">Seja Parceiro</a></li>
        </ul>
      </div>
      <div class="flex flex-col items-center md:items-start">
        <h3 class="text-white font-bold mb-4 uppercase tracking-widest text-sm">Contato</h3>
        <ul class="space-y-2 text-gray-400">
          <li><a href="tel:+5561991344563" class="hover:text-yellow-400 transition">${svg.phone()}(61) 99134-4563</a></li>
          <li><a href="mailto:contato@freteq.com.br" class="hover:text-yellow-400 transition">${svg.mail()}contato@freteq.com.br</a></li>
          <li class="text-sm">QNG 27 Lote 02 Loja 03 — Taguatinga Norte, DF</li>
        </ul>
      </div>
      <div class="flex flex-col items-center md:items-start">
        <h3 class="text-white font-bold mb-4 uppercase tracking-widest text-sm">Redes Sociais</h3>
        <a href="${IG}" target="_blank" rel="noopener noreferrer" aria-label="Instagram da FreteQ" class="bg-gray-800 p-3 rounded-full hover:bg-yellow-400 hover:text-black transition">${svg.instagram()}</a>
      </div>
    </div>
    <div class="border-t border-gray-800 pt-8 text-center">
      <p class="text-xs text-gray-500 uppercase tracking-widest">&copy; <span data-year>2026</span> FreteQ Logística. Todos os direitos reservados.</p>
    </div>
  </div>
</footer>`
}

export function whatsappCard({ title = 'Ficou com alguma dúvida?', text = 'Nossa equipe está pronta para te atender de forma rápida e humanizada pelo WhatsApp. Chama a gente!', cta = 'FALAR NO WHATSAPP' } = {}) {
  return `
<section class="py-12 px-4 md:px-6" aria-labelledby="whatsapp-cta">
  <div class="container mx-auto">
    <div class="bg-green-500 rounded-3xl p-8 md:p-12 text-center shadow-2xl max-w-5xl mx-auto relative overflow-hidden">
      <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-400 rounded-full opacity-50" aria-hidden="true"></div>
      <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-green-600 rounded-full opacity-50" aria-hidden="true"></div>
      <div class="relative z-10">
        <div class="bg-white text-green-500 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-lg">${svg.message()}</div>
        <h2 id="whatsapp-cta" class="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">${title}</h2>
        <p class="text-green-50 text-base md:text-xl mb-8 max-w-2xl mx-auto">${text}</p>
        <a href="${WA}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center bg-white text-green-600 font-black px-8 md:px-12 py-4 md:py-5 rounded-xl text-lg md:text-xl hover:bg-gray-100 hover:scale-105 transition transform shadow-xl w-full sm:w-auto">
          ${svg.whatsapp()}${cta}
        </a>
      </div>
    </div>
  </div>
</section>`
}

export function localBusinessLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE}/#business`,
    name: 'FreteQ',
    alternateName: 'FreteQ Logística',
    description: 'Agência de envios e frete barato em Brasília. Compare Loggi, J&T e Latam Cargo. Cotação online, etiqueta e despacho em Taguatinga Norte.',
    url: SITE,
    telephone: '+55-61-99134-4563',
    email: 'contato@freteq.com.br',
    image: `${SITE}/og-image.jpg`,
    logo: `${SITE}/assets/img/logo-freteq-512.webp`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'QNG 27 Lote 02 Loja 03',
      addressLocality: 'Taguatinga Norte',
      addressRegion: 'DF',
      postalCode: '72130-370',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -15.8267,
      longitude: -48.0645,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
    ],
    areaServed: [
      { '@type': 'City', name: 'Brasília' },
      { '@type': 'AdministrativeArea', name: 'Distrito Federal' },
    ],
    sameAs: [IG],
    hasMap: MAPS,
  }
}

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: 'FreteQ',
    url: SITE,
    logo: `${SITE}/assets/img/logo-freteq-512.webp`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-61-99134-4563',
      contactType: 'customer service',
      areaServed: 'BR',
      availableLanguage: 'Portuguese',
    },
  }
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE,
    name: 'FreteQ',
    description: 'Frete barato em Brasília — calcular frete online, emitir etiqueta e rastrear encomenda.',
    publisher: { '@id': `${SITE}/#organization` },
    inLanguage: 'pt-BR',
  }
}

export function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE}${item.url}`,
    })),
  }
}

export { SITE, APP, WA, MAPS, IG, svg }
