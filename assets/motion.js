if ('IntersectionObserver' in window && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const {target, isIntersecting} of entries) {
      if (!isIntersecting) continue
      target.classList.remove('reveal-pending')
      observer.unobserve(target)
    }
  }, {rootMargin: '0px 0px -4% 0px'})
  for (const item of document.querySelectorAll('.reading > :not(.entries), .entries > li')) {
    if (item.getBoundingClientRect().top < innerHeight) continue
    item.classList.add('reveal-pending')
    observer.observe(item)
  }
}
