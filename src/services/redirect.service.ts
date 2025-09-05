export const redirectToLogin = (): void => {
  window.location.href = '/login'
}

export const getReturnUrlFromLocation = (): string | null => {
  const params = new URLSearchParams(window.location.search)
  return params.get('redirect')
}
