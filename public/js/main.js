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

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu()
  initFadeIn()
  initYear()
})
