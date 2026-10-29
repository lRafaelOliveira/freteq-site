function initMobileMenu() {
  const button = document.getElementById('mobile-menu-button')
  const menu = document.getElementById('mobile-menu')
  if (!button || !menu) return
  button.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden') === false
    button.setAttribute('aria-expanded', String(open))
  })
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden')
      button.setAttribute('aria-expanded', 'false')
    })
  })
}

function initFadeIn() {
  const sections = document.querySelectorAll('.fade-in-section')
  if (!sections.length || !('IntersectionObserver' in window)) {
    sections.forEach((s) => s.classList.add('is-visible'))
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 },
  )
  sections.forEach((section) => observer.observe(section))
}

function initYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear())
  })
}

function headerOffset() {
  const header = document.querySelector('header')
  return (header ? header.getBoundingClientRect().height : 72) + 8
}

function scrollToId(id, behavior = 'smooth') {
  const el = document.getElementById(id)
  if (!el) return false
  el.classList.add('is-visible')
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset()
  window.scrollTo({ top: Math.max(0, top), behavior })
  return true
}

function initInPageNav() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]')
    if (!link) return
    const href = link.getAttribute('href')
    if (!href) return
    const hashIndex = href.indexOf('#')
    if (hashIndex === -1) return
    const id = href.slice(hashIndex + 1)
    if (!id) return
    if (href.startsWith('/#') && location.pathname !== '/') return
    if (!document.getElementById(id)) return
    event.preventDefault()
    if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`)
    scrollToId(id)
  })

  const initial = location.hash.replace('#', '')
  if (initial) {
    requestAnimationFrame(() => scrollToId(initial, 'auto'))
  }

  window.addEventListener('popstate', () => {
    const id = location.hash.replace('#', '')
    if (id) scrollToId(id)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu()
  initFadeIn()
  initYear()
  initInPageNav()
})
