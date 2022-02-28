export function shake(what, duration, amplitude) {
  const ctx = { progress: 0 }
  TweenMax.to(ctx, duration, {
    progress: 1,
    onUpdate() {
      const { progress } = ctx
      TweenMax.set(what, {
        rotation: Math.cos(progress * 20) * amplitude * (1 - progress),
      })
    },
  })
}
