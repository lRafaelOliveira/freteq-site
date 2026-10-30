import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  APP,
  MAPS,
  WA,
  breadcrumbLd,
  footer,
  head,
  header,
  localBusinessLd,
  organizationLd,
  svg,
  websiteLd,
  whatsappCard,
} from './layout.mjs'

const PUBLIC = fileURLToPath(new URL('../public', import.meta.url))

const faqItems = [
  {
    q: 'Quais itens não posso enviar?',
    a: 'Não enviamos produtos perigosos, inflamáveis, armas, animais vivos ou dinheiro. Consulte a lista completa na unidade de Taguatinga Norte.',
  },
  {
    q: 'Onde eu despacho a encomenda?',
    a: 'Cada transportadora tem o próprio ponto de coleta. Informe seu CEP em Pontos de Coleta para ver o LoggiPonto, a unidade J&T ou a central FreteQ mais perto. Depois de pagar e imprimir a etiqueta, leve o pacote no ponto e acompanhe o rastreio.',
  },
  {
    q: 'Minha encomenda tem seguro?',
    a: 'Sim, todos os envios possuem seguro básico baseado no valor declarado no momento da cotação e emissão da etiqueta.',
  },
  {
    q: 'Como devo embalar?',
    a: 'Utilize caixas de papelão em bom estado, proteja itens frágeis com plástico bolha e vede bem com fita adesiva larga.',
  },
]

function faqLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

async function writeIndex() {
  const html = `${head({
    title: 'FreteQ — Frete Barato e Envio de Encomendas em Brasília',
    description:
      'Calcule frete barato em Brasília, emita etiqueta online e despache na unidade FreteQ em Taguatinga Norte. Loggi, J&T e Latam Cargo.',
    path: '/',
    jsonLd: [localBusinessLd(), organizationLd(), websiteLd(), faqLd()],
  })}
<body class="bg-gray-100 text-gray-800 flex flex-col min-h-screen">
${header({ active: 'home' })}
<main class="flex-grow">
  <section class="relative text-white overflow-hidden" aria-labelledby="hero-title">
    <picture>
      <source media="(max-width: 767px)" srcset="/assets/img/hero-freteq-mobile.webp" type="image/webp">
      <source media="(min-width: 768px)" srcset="/assets/img/hero-freteq-768.webp 768w, /assets/img/hero-freteq-1280.webp 1280w, /assets/img/hero-freteq-1920.webp 1920w" sizes="100vw" type="image/webp">
      <img src="/assets/img/hero-freteq-1280.webp" alt="Armazém automatizado FreteQ — logística inteligente para envio de encomendas em Brasília" width="1920" height="659" fetchpriority="high" decoding="async" class="absolute inset-0 w-full h-full object-cover">
    </picture>
    <div class="absolute inset-0 bg-black/70" aria-hidden="true"></div>
    <div class="relative container mx-auto px-6 py-20 md:py-32 lg:py-40 text-center">
      <h1 id="hero-title" class="text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-6 uppercase tracking-tight">Envie suas encomendas com mais economia e praticidade.</h1>
      <p class="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 md:mb-12">Compare os preços das melhores transportadoras e garanta o frete mais barato de Brasília.</p>
      <div class="flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0">
        <a href="/calcular-frete/" class="bg-yellow-400 text-black font-black px-8 py-4 rounded-xl text-lg md:text-xl hover:bg-yellow-300 transition transform hover:scale-105 shadow-xl w-full sm:w-auto">CALCULAR FRETE AGORA</a>
      </div>
    </div>
  </section>

  <section id="como-funciona" class="py-16 md:py-24 bg-gray-50 fade-in-section">
    <div class="container mx-auto px-6 text-center">
      <div class="mb-10 md:mb-16">
        <h2 class="text-3xl md:text-5xl font-black text-gray-900 uppercase">Simples e Rápido</h2>
        <p class="text-gray-600 mt-3 md:text-lg">Veja como é fácil economizar com a FreteQ</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        ${[
          ['1', 'Simule Online', 'Acesse nossa calculadora e compare transportadoras instantaneamente.'],
          ['2', 'Pague e Imprima', 'Pague com segurança e gere sua etiqueta de envio em segundos.'],
          ['3', 'Leve no ponto', 'Despache no ponto de coleta da transportadora mais perto de você. <a href="#pontos" class="font-bold text-gray-900 underline underline-offset-2">Ver pontos</a>'],
          ['4', 'Rastreie', 'Acompanhe sua encomenda passo a passo até o destino final.'],
        ]
          .map(
            ([n, t, d]) => `
        <div class="flex flex-col items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div class="bg-yellow-400 text-black rounded-2xl w-16 h-16 flex items-center justify-center text-2xl font-black mb-6 shadow-md">${n}</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">${t}</h3>
          <p class="text-gray-600">${d}</p>
        </div>`,
          )
          .join('')}
      </div>
    </div>
  </section>

  <section id="servicos" class="py-16 md:py-24 bg-white fade-in-section">
    <div class="container mx-auto px-6">
      <div class="text-center mb-10 md:mb-16">
        <h2 class="text-3xl md:text-5xl font-black text-gray-900 uppercase">Vantagens Exclusivas</h2>
        <p class="text-gray-600 mt-3 md:text-lg">Logística inteligente para você e sua empresa.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div class="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition">
          <div class="bg-yellow-400 text-black w-14 h-14 flex items-center justify-center rounded-2xl mb-6 shadow-md">${svg.dollar()}</div>
          <h3 class="text-xl font-bold mb-3 text-gray-900">Preços Imbatíveis</h3>
          <p class="text-gray-600 leading-relaxed">Economize até 70% nos seus envios utilizando nossas tabelas negociadas.</p>
        </div>
        <div class="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition">
          <div class="bg-black text-yellow-400 w-14 h-14 flex items-center justify-center rounded-2xl mb-6 shadow-md">${svg.mapPin()}</div>
          <h3 class="text-xl font-bold mb-3 text-gray-900">Pontos de Coleta</h3>
          <p class="text-gray-600 leading-relaxed">Loggi, J&amp;T e Latam Cargo têm pontos perto de você. Informe o CEP e encontre o mais próximo. <a href="#pontos" class="font-bold text-gray-900 underline underline-offset-2">Ver pontos</a></p>
        </div>
        <div class="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition">
          <div class="bg-yellow-400 text-black w-14 h-14 flex items-center justify-center rounded-2xl mb-6 shadow-md">${svg.truck()}</div>
          <h3 class="text-xl font-bold mb-3 text-gray-900">Grandes Parceiros</h3>
          <p class="text-gray-600 leading-relaxed">Trabalhamos com Loggi, J&amp;T e Latam Cargo.</p>
        </div>
        <div class="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition">
          <div class="bg-black text-yellow-400 w-14 h-14 flex items-center justify-center rounded-2xl mb-6 shadow-md">${svg.packageCheck()}</div>
          <h3 class="text-xl font-bold mb-3 text-gray-900">Rastreio Dinâmico</h3>
          <p class="text-gray-600 leading-relaxed">Saiba exatamente onde está sua encomenda com painel em tempo real.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="sobre-nos" class="py-16 md:py-24 bg-gray-50 fade-in-section">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div class="order-2 lg:order-1">
          <h2 class="text-3xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tight">Brasília conectada ao Brasil</h2>
          <p class="text-base md:text-lg text-gray-600 mb-4 leading-relaxed">A FreteQ nasceu com a missão de simplificar a logística para empreendedores e para todos que precisam enviar encomendas. Entendemos a dinâmica da capital e oferecemos soluções que combinam tecnologia de ponta com um atendimento humano.</p>
          <p class="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">Nossa equipe busca as melhores rotas e preços para que sua única preocupação seja o sucesso do seu negócio.</p>
          <div class="grid grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div><p class="text-3xl md:text-4xl font-black text-yellow-500 mb-1">+1000</p><p class="text-gray-600 font-bold uppercase text-xs md:text-sm">Clientes Atendidos</p></div>
            <div><p class="text-3xl md:text-4xl font-black text-yellow-500 mb-1">03</p><p class="text-gray-600 font-bold uppercase text-xs md:text-sm">Transportadoras</p></div>
          </div>
        </div>
        <div class="order-1 lg:order-2 relative">
          <div class="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full z-0 opacity-50" aria-hidden="true"></div>
          <img src="/assets/img/equipe-freteq-640.webp" srcset="/assets/img/equipe-freteq-640.webp 640w, /assets/img/equipe-freteq-1024.webp 1024w" sizes="(max-width:1024px) 100vw, 512px" width="1024" height="626" alt="Equipe FreteQ na unidade de envios em Taguatinga Norte, Brasília" loading="lazy" decoding="async" class="rounded-3xl shadow-2xl relative z-10 w-full object-cover">
        </div>
      </div>
    </div>
  </section>

  <section id="missao" class="py-16 md:py-24 bg-white fade-in-section">
    <div class="container mx-auto px-6">
      <div class="text-center mb-10 md:mb-16">
        <h2 class="text-3xl md:text-5xl font-black text-gray-900 uppercase">Nossa Cultura</h2>
        <p class="text-gray-600 mt-3 md:text-lg">Pilares que guiam nossa excelência.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div class="text-center p-8 bg-gray-50 rounded-3xl border border-gray-100">
          <div class="bg-yellow-400 text-black rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-6">${svg.rocket()}</div>
          <h3 class="text-xl font-bold mb-3 text-gray-900">Missão</h3>
          <p class="text-gray-600">Descomplicar a logística com economia e agilidade para todo o país.</p>
        </div>
        <div class="text-center p-8 bg-gray-50 rounded-3xl border border-gray-100">
          <div class="bg-yellow-400 text-black rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-6">${svg.eye()}</div>
          <h3 class="text-xl font-bold mb-3 text-gray-900">Visão</h3>
          <p class="text-gray-600">Ser referência em soluções de frete inteligente em Brasília e região.</p>
        </div>
        <div class="text-center p-8 bg-gray-50 rounded-3xl border border-gray-100">
          <div class="bg-yellow-400 text-black rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-6">${svg.gem()}</div>
          <h3 class="text-xl font-bold mb-3 text-gray-900">Valores</h3>
          <p class="text-gray-600">Transparência, parceria genuína, eficiência e inovação contínua.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="depoimentos" class="py-16 md:py-24 bg-gray-50 fade-in-section">
    <div class="container mx-auto px-6">
      <div class="text-center mb-10 md:mb-16">
        <h2 class="text-3xl md:text-5xl font-black text-gray-900 uppercase">O que dizem de nós</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        ${[
          ['"A FreteQ transformou a logística do meu e-commerce. Fretes muito mais baratos e incrivelmente rápidos."', 'Joana Silva', 'Brasília-DF'],
          ['"Atendimento excelente na unidade física. Finalmente uma solução de fretes moderna e acessível em Taguatinga."', 'Marcos Andrade', 'Artesão'],
          ['"Praticidade incrível. Calculo em casa e só deixo o pacote na loja. Economizo um tempo precioso."', 'Carla Mendes', 'Plano Piloto-DF'],
        ]
          .map(
            ([quote, name, role]) => `
        <blockquote class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative">
          <div class="absolute top-6 right-6 text-yellow-100" aria-hidden="true">${svg.quote()}</div>
          <p class="text-gray-600 italic mb-6 relative z-10">${quote}</p>
          <footer class="border-t border-gray-100 pt-4">
            <p class="font-bold text-gray-900">${name}</p>
            <p class="text-xs text-yellow-600 font-bold uppercase tracking-tighter">${role}</p>
          </footer>
        </blockquote>`,
          )
          .join('')}
      </div>
    </div>
  </section>

  <section id="faq" class="py-16 md:py-24 bg-white fade-in-section">
    <div class="container mx-auto px-6 max-w-3xl">
      <div class="text-center mb-10 md:mb-16">
        <h2 class="text-3xl md:text-5xl font-black text-gray-900 uppercase">Dúvidas Frequentes</h2>
      </div>
      <div class="space-y-4">
        ${faqItems
          .map(
            (item) => `
        <details class="faq-item border border-gray-200 rounded-2xl bg-gray-50 overflow-hidden group">
          <summary class="flex justify-between items-center p-5">
            <h3 class="text-base md:text-lg font-bold text-gray-900">${item.q}</h3>
            ${svg.chevron()}
          </summary>
          <div class="px-5 pb-5">
            <p class="text-sm md:text-base text-gray-600">${item.a}</p>
          </div>
        </details>`,
          )
          .join('')}
      </div>
    </div>
  </section>

  <section id="parceiros" class="py-16 md:py-24 bg-gray-50 fade-in-section">
    <div class="container mx-auto px-6 text-center">
      <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-10 md:mb-16 uppercase tracking-wide">Melhores Transportadoras do Brasil</h2>
      <div class="flex flex-wrap justify-center items-center gap-8 md:gap-14 grayscale opacity-50 hover:grayscale-0 transition-all duration-500">
        <img src="/assets/img/loggi.webp" alt="Logo Loggi — entregas rápidas em Brasília" width="226" height="74" loading="lazy" class="h-10 md:h-14 w-auto object-contain">
        <img src="/assets/img/jt-express.webp" alt="Logo J&amp;T Express Brasília" width="112" height="112" loading="lazy" class="h-10 md:h-14 w-auto object-contain">
        <img src="/assets/img/latam.webp" alt="Logo Latam Cargo" width="289" height="90" loading="lazy" class="h-10 md:h-14 w-auto object-contain">
      </div>
    </div>
  </section>

  ${whatsappCard()}

  <section id="pontos" class="py-16 md:py-24 bg-yellow-400 text-black">
    <div class="container mx-auto px-6">
      <div class="text-center max-w-3xl mx-auto mb-10 md:mb-14">
        <h2 class="text-3xl md:text-5xl font-black uppercase mb-4 tracking-tight">Pontos de Coleta</h2>
        <p class="text-base md:text-xl font-medium">Pague, imprima a etiqueta e leve no ponto da transportadora mais perto de você. Depois é só acompanhar o rastreio.</p>
      </div>

      <div class="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-2xl mb-8">
        <form id="pontos-form" class="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div class="flex-1 w-full">
            <label for="pontos-cep" class="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Seu CEP</label>
            <input type="text" id="pontos-cep" name="cep" inputmode="numeric" autocomplete="postal-code" placeholder="Ex: 72130-370" maxlength="9" required class="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-yellow-400 outline-none transition bg-gray-50 text-gray-900">
          </div>
          <button type="submit" id="pontos-submit" class="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-xl font-black hover:bg-gray-800 transition shadow-xl text-lg">Buscar pontos</button>
        </form>
        <p class="text-sm text-gray-500 mt-3">Mostramos os pontos Loggi e J&amp;T mais próximos. Latam Cargo despacha na unidade FreteQ.</p>
      </div>

      <div id="pontos-results" class="pontos-grid max-w-6xl mx-auto">
        <article class="bg-white p-6 rounded-3xl shadow-xl text-left h-full flex flex-col">
          <p class="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Central FreteQ · Latam Cargo</p>
          <h3 class="text-xl font-black text-gray-900 mb-2">Unidade Taguatinga Norte</h3>
          <p class="text-gray-600 font-medium mb-4">QNG 27 Lote 02 Loja 03<br>Taguatinga Norte - DF, 72130-370</p>
          <p class="text-sm text-gray-500 mb-5">${svg.clock()}Seg à Sex: 08h - 18h | Sáb: 09h - 13h</p>
          <a href="${MAPS}" target="_blank" rel="noopener noreferrer" class="mt-auto inline-flex w-full justify-center bg-black text-white px-6 py-3 rounded-xl font-black hover:bg-gray-800 transition">Abrir no mapa</a>
        </article>
        <article class="bg-white/70 p-6 rounded-3xl border-2 border-dashed border-black/10 flex items-center justify-center text-center min-h-48">
          <p class="text-gray-700 font-medium">Informe o CEP para ver os <strong>LoggiPontos</strong> mais perto de você.</p>
        </article>
        <article class="bg-white/70 p-6 rounded-3xl border-2 border-dashed border-black/10 flex items-center justify-center text-center min-h-48">
          <p class="text-gray-700 font-medium">Informe o CEP para ver as unidades <strong>J&amp;T</strong> mais perto de você.</p>
        </article>
      </div>
    </div>
  </section>
</main>
${footer()}
<script type="module" src="/js/main.js"></script>
<script type="module" src="/js/pontos.js"></script>
</body>
</html>`
  await writeFile(join(PUBLIC, 'index.html'), html)
  console.log('index.html')
}

async function writeQuote() {
  await mkdir(join(PUBLIC, 'calcular-frete'), { recursive: true })
  const html = `${head({
    title: 'Calcular Frete Online em Brasília | FreteQ',
    description:
      'Simule frete barato em Brasília: compare Loggi, J&T e Latam Cargo em segundos. Cotação online FreteQ com preços e prazos reais.',
    path: '/calcular-frete/',
    jsonLd: [
      breadcrumbLd([
        { name: 'Início', url: '/' },
        { name: 'Calcular Frete', url: '/calcular-frete/' },
      ]),
      localBusinessLd(),
    ],
  })}
<body class="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
${header({ active: 'calcular' })}
<main class="flex-grow py-8 md:py-16 px-4">
  <div class="container mx-auto">
    <nav class="max-w-4xl mx-auto mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
      <ol class="flex gap-2">
        <li><a href="/" class="hover:text-yellow-600">Início</a></li>
        <li aria-hidden="true">/</li>
        <li class="text-gray-900 font-medium">Calcular Frete</li>
      </ol>
    </nav>
    <div class="max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-3xl shadow-xl border border-gray-100">
      <div class="text-center mb-8 md:mb-10">
        <h1 class="text-2xl md:text-4xl font-black text-gray-900 mb-2 md:mb-4 uppercase tracking-tight">Simulador de Frete</h1>
        <p class="text-sm md:text-base text-gray-600">Obtenha cotações em tempo real das melhores transportadoras para envios a partir de Brasília.</p>
      </div>
      <div id="quote-unavailable" class="hidden text-center p-6 bg-amber-50 text-amber-900 rounded-2xl border border-amber-100 mb-6">
        <p class="font-medium mb-4">Simulador temporariamente indisponível. Fale conosco pelo WhatsApp para cotar seu frete.</p>
        <a href="${WA}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center bg-green-500 text-white font-bold px-6 py-3 rounded-xl">Chamar WhatsApp</a>
      </div>
      <form id="quote-form" class="space-y-6 md:space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div>
            <label for="cepOrigem" class="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">CEP Origem</label>
            <input type="text" id="cepOrigem" name="cepOrigem" inputmode="numeric" autocomplete="postal-code" placeholder="Ex: 72130-370" maxlength="9" class="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-yellow-400 outline-none transition bg-gray-50" required value="72130-370">
          </div>
          <div>
            <label for="cepDestino" class="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">CEP Destino</label>
            <input type="text" id="cepDestino" name="cepDestino" inputmode="numeric" autocomplete="postal-code" placeholder="Ex: 01015-000" maxlength="9" class="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-yellow-400 outline-none transition bg-gray-50" required>
          </div>
          <div>
            <label for="valorDeclarado" class="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Valor Declarado (R$)</label>
            <input type="number" id="valorDeclarado" name="valorDeclarado" min="0" step="0.01" placeholder="100.00" class="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-yellow-400 outline-none transition bg-gray-50" required>
          </div>
        </div>
        <div class="border-t border-gray-100 pt-6 md:pt-8">
          <h2 class="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tighter mb-6">Dimensões do pacote</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-5 md:p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
            <div>
              <label for="peso" class="block text-[10px] font-black text-gray-400 uppercase mb-1">Peso (g)</label>
              <input type="number" id="peso" name="peso" min="1" max="100000" placeholder="Ex: 500" class="w-full p-3 border border-gray-200 rounded-lg focus:border-yellow-400 outline-none" required>
            </div>
            <div>
              <label for="altura" class="block text-[10px] font-black text-gray-400 uppercase mb-1">Altura (cm)</label>
              <input type="number" id="altura" name="altura" min="1" max="200" step="0.1" placeholder="Ex: 10" class="w-full p-3 border border-gray-200 rounded-lg focus:border-yellow-400 outline-none" required>
            </div>
            <div>
              <label for="largura" class="block text-[10px] font-black text-gray-400 uppercase mb-1">Largura (cm)</label>
              <input type="number" id="largura" name="largura" min="1" max="200" step="0.1" placeholder="Ex: 15" class="w-full p-3 border border-gray-200 rounded-lg focus:border-yellow-400 outline-none" required>
            </div>
            <div>
              <label for="comprimento" class="block text-[10px] font-black text-gray-400 uppercase mb-1">Comp. (cm)</label>
              <input type="number" id="comprimento" name="comprimento" min="1" max="200" step="0.1" placeholder="Ex: 20" class="w-full p-3 border border-gray-200 rounded-lg focus:border-yellow-400 outline-none" required>
            </div>
          </div>
        </div>
        <div class="pt-6">
          <button type="submit" id="quote-submit" class="bg-yellow-400 text-black font-black w-full py-5 rounded-2xl text-lg md:text-xl hover:bg-yellow-300 transition shadow-xl uppercase tracking-tighter">
            SIMULAR PREÇOS E PRAZOS
          </button>
        </div>
      </form>
      <div id="quote-results" class="mt-10" role="status" aria-live="polite"></div>
      <p class="mt-8 text-center text-sm text-gray-500">Gostou do preço? <a href="${APP}/cadastro" class="text-yellow-600 font-bold hover:underline">Crie sua conta</a> e emita a etiqueta no painel FreteQ.</p>
    </div>
  </div>
</main>
<section class="pb-12 px-4">
  <div class="container mx-auto">
    <div class="bg-green-500 rounded-3xl p-6 md:p-10 text-center shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
      <div class="text-left mb-6 md:mb-0 md:mr-6 flex-1">
        <h2 class="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">Dúvidas na cotação?</h2>
        <p class="text-green-100 text-sm md:text-base">Fale com um atendente agora mesmo pelo WhatsApp.</p>
      </div>
      <a href="${WA}" target="_blank" rel="noopener noreferrer" class="flex-shrink-0 inline-flex items-center justify-center bg-white text-green-600 font-black px-6 md:px-8 py-4 rounded-xl text-base hover:bg-gray-100 transition shadow-lg w-full md:w-auto">
        ${svg.whatsapp('w-6 h-6 mr-2')}CHAMAR WHATSAPP
      </a>
    </div>
  </div>
</section>
<footer class="bg-black text-white py-8 text-center text-xs text-gray-500 uppercase tracking-widest border-t border-gray-900">
  <p>&copy; <span data-year>2026</span> FreteQ — Brasília DF · <a href="/" class="hover:text-yellow-400">Voltar ao site</a></p>
</footer>
<script type="module" src="/js/main.js"></script>
<script type="module" src="/js/quote.js"></script>
</body>
</html>`
  await writeFile(join(PUBLIC, 'calcular-frete', 'index.html'), html)
  console.log('calcular-frete/index.html')
}

async function writeTracking() {
  await mkdir(join(PUBLIC, 'rastreamento'), { recursive: true })
  const html = `${head({
    title: 'Rastrear Encomenda Online | FreteQ Brasília',
    description:
      'Rastreie sua encomenda FreteQ em tempo real. Digite o código de rastreio e acompanhe a entrega passo a passo.',
    path: '/rastreamento/',
    jsonLd: [
      breadcrumbLd([
        { name: 'Início', url: '/' },
        { name: 'Rastreamento', url: '/rastreamento/' },
      ]),
      localBusinessLd(),
    ],
  })}
<body class="bg-gray-100 text-gray-800 flex flex-col min-h-screen">
${header({ active: 'rastrear' })}
<main class="flex-grow">
  <section id="rastreamento" class="py-16 md:py-20 bg-white">
    <div class="container mx-auto px-6">
      <nav class="max-w-2xl mx-auto mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <ol class="flex gap-2">
          <li><a href="/" class="hover:text-yellow-600">Início</a></li>
          <li aria-hidden="true">/</li>
          <li class="text-gray-900 font-medium">Rastreamento</li>
        </ol>
      </nav>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">Rastreie sua Encomenda</h1>
        <p class="text-gray-600 mt-2">Acompanhe seu envio em tempo real, de ponta a ponta.</p>
      </div>
      <div class="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-100">
        <form id="tracking-form" class="flex flex-col sm:flex-row gap-4">
          <label for="tracking-code" class="sr-only">Código de rastreio</label>
          <input type="text" id="tracking-code" name="code" placeholder="Digite o código de rastreio" autocomplete="off" class="w-full p-3 border border-gray-300 rounded-lg flex-grow focus:border-yellow-400 outline-none" required>
          <button type="submit" class="bg-black text-white font-bold px-8 py-3 rounded-lg hover:bg-gray-800 transition">Rastrear</button>
        </form>
        <div id="tracking-results" class="mt-8" role="status" aria-live="polite"></div>
      </div>
    </div>
  </section>
</main>
${footer()}
<script type="module" src="/js/main.js"></script>
<script type="module" src="/js/tracking.js"></script>
</body>
</html>`
  await writeFile(join(PUBLIC, 'rastreamento', 'index.html'), html)
  console.log('rastreamento/index.html')
}

async function write404() {
  const html = `${head({
    title: 'Página não encontrada | FreteQ',
    description: 'A página que você procura não existe. Volte para o site da FreteQ.',
    path: '/404.html',
    jsonLd: [],
  })}
<body class="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
${header()}
<main class="flex-grow flex items-center justify-center px-6 py-20">
  <div class="text-center max-w-lg">
    <p class="text-8xl font-black text-yellow-400 mb-4">404</p>
    <h1 class="text-3xl font-black text-gray-900 mb-4 uppercase">Página não encontrada</h1>
    <p class="text-gray-600 mb-8">O endereço pode ter mudado. Calcule seu frete ou volte para a página inicial.</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/" class="bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl">Ir para o início</a>
      <a href="/calcular-frete/" class="bg-black text-white font-bold px-6 py-3 rounded-xl">Calcular frete</a>
    </div>
  </div>
</main>
${footer()}
<script type="module" src="/js/main.js"></script>
</body>
</html>`
  await writeFile(join(PUBLIC, '404.html'), html)
  console.log('404.html')
}

await writeIndex()
await writeQuote()
await writeTracking()
await write404()
