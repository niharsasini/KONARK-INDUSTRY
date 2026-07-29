export async function animateIn(
  selector: string,
  options: {
    y?: number
    x?: number
    opacity?: number
    scale?: number
    blur?: number
    stagger?: number
    delay?: number
    duration?: number
    ease?: string
    start?: string
    trigger?: string
  } = {}
) {
  if (typeof window === 'undefined') return
  try {
    const gsapMod = await import('gsap')
    const gsap = gsapMod.default
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    const {
      y = 40, x = 0, opacity = 0,
      scale = 1, blur = 0,
      stagger = 0, delay = 0,
      duration = 0.75,
      ease = 'power3.out',
      start = 'top 85%',
      trigger = selector,
    } = options

    const fromVars: any = { opacity, delay, duration, ease }
    if (y !== 0) fromVars.y = y
    if (x !== 0) fromVars.x = x
    if (scale !== 1) fromVars.scale = scale
    if (blur > 0) fromVars.filter = `blur(${blur}px)`
    if (stagger > 0) fromVars.stagger = stagger

    const triggerEl = document.querySelector(trigger)
    if (!triggerEl) return

    fromVars.scrollTrigger = {
      trigger: triggerEl,
      start,
      toggleActions: 'play none none none',
    }

    const els = document.querySelectorAll(selector)
    if (!els.length) return

    gsap.from(els.length === 1 ? els[0] : Array.from(els), fromVars)
  } catch (e) {}
}

export async function counterUp(
  el: HTMLElement,
  endValue: number,
  duration = 2.5
) {
  if (typeof window === 'undefined') return
  try {
    const gsapMod = await import('gsap')
    const gsap = gsapMod.default
    const obj = { val: 0 }
    gsap.to(obj, {
      val: endValue,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(obj.val)
          .toLocaleString('en-IN')
      },
    })
  } catch (e) {}
}
