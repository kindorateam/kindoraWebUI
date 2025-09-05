const getCurrentHref = (): string =>
  window.location.pathname + window.location.search + window.location.hash

export const redirectToLogin = (): void => {
  const redirect = encodeURIComponent(getCurrentHref())
  const url = `/login?redirect=${redirect}`

  try {
    // Navigate via router if available; otherwise fallback to full reload

    import('@/router')
      .then((m) => {
        void m.router.navigate({ href: url, replace: true })
      })
      .catch(() => {
        window.location.assign(url)
      })
  } catch {
    // As a last resort, perform a full page navigation
    window.location.assign(url)
  }
}

export const getReturnUrlFromLocation = (): string | null => {
  const params = new URLSearchParams(window.location.search)
  return params.get('redirect')
}
