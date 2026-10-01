const root = document.documentElement
const header = document.querySelector('.header')
const progress = document.querySelector('.progress')
const nav = document.querySelector('.header-nav')
const burger = document.querySelector('[data-trigger="menu"]')
const promo = document.querySelector('.promo')
const promoClose = document.querySelector('[data-trigger="promo-close"]')
const revealItems = document.querySelectorAll('[data-reveal]')
const tocLinks = document.querySelectorAll('.toc__link')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const SCROLLED_OFFSET = 10
const REVEAL_FALLBACK_DELAY = 1500
const PROMO_STORAGE_KEY = 'promoClosed'

const onScroll = () => {
  const max = root.scrollHeight - root.clientHeight
  const ratio = max > 0 ? (root.scrollTop / max) * 100 : 0
  progress.style.setProperty('--progress-w', `${ratio}%`)
  header.classList.toggle('header--scrolled', root.scrollTop > SCROLLED_OFFSET)
}

const showAll = () => {
  revealItems.forEach((item) => item.classList.add('reveal--visible'))
}

const closeMenu = () => {
  nav.classList.remove('header-nav--open')
  burger.classList.remove('header-burger--active')
  burger.setAttribute('aria-expanded', 'false')
}

window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

revealItems.forEach((item) => item.classList.add('reveal'))

if (reduceMotion) {
  showAll()
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible')
        revealObserver.unobserve(entry.target)
      }
    })
  }, { rootMargin: '0px 0px 160px 0px', threshold: 0.01 })

  revealItems.forEach((item) => revealObserver.observe(item))
  setTimeout(showAll, REVEAL_FALLBACK_DELAY)
}

const tocObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return
    }
    tocLinks.forEach((link) => {
      link.classList.toggle('toc__link--active', link.getAttribute('href') === `#${entry.target.id}`)
    })
  })
}, { rootMargin: '-25% 0px -65% 0px' })

tocLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute('href'))
  if (section) {
    tocObserver.observe(section)
  }
})

burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('header-nav--open')
  burger.classList.toggle('header-burger--active', isOpen)
  burger.setAttribute('aria-expanded', String(isOpen))
})

nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    closeMenu()
  }
})

if (sessionStorage.getItem(PROMO_STORAGE_KEY)) {
  promo.classList.add('promo--hidden')
}

promoClose.addEventListener('click', () => {
  promo.classList.add('promo--hidden')
  sessionStorage.setItem(PROMO_STORAGE_KEY, '1')
})
