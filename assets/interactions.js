// Pointer feedback is decorative and never intercepts navigation.
const motion = matchMedia('(prefers-reduced-motion: reduce)')
document.addEventListener('pointerdown', event => {
  if (motion.matches || !event.isPrimary || event.button !== 0) return
  const pulse = document.createElement('span')
  pulse.className = 'click-pulse'
  pulse.setAttribute('aria-hidden', 'true')
  pulse.style.left = event.clientX + 'px'
  pulse.style.top = event.clientY + 'px'
  document.body.append(pulse)
  pulse.addEventListener('animationend', () => pulse.remove(), {once:true})
  setTimeout(() => pulse.remove(), 700)
}, {passive:true})

const toggle = document.querySelector('.ticker-toggle')
if (toggle) {
  const ticker = toggle.closest('.ticker')
  toggle.hidden = false
  toggle.addEventListener('click', () => {
    const paused = ticker.classList.toggle('is-paused')
    toggle.textContent = paused ? '播放字幕' : '暂停字幕'
  })
}
