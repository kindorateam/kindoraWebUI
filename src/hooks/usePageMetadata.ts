import { useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'

const APP_NAME = 'Kindora'

interface Breadcrumb {
  title: string
  path: string
  isLast: boolean
}

interface PageMetadata {
  breadcrumbs: Breadcrumb[]
  pageTitle: string
  documentTitle: string
}

export const usePageMetadata = (): PageMetadata => {
  const matches = useRouterState({ select: (s) => s.matches })

  // Extract breadcrumbs from matches
  const breadcrumbs = matches
    .filter((match) => match.context?.breadcrumb)
    .map((match, index, array) => ({
      title: match.context.breadcrumb as string,
      path: match.pathname,
      isLast: index === array.length - 1,
    }))

  // Filter out "Home" for cleaner titles
  const filteredTitles = breadcrumbs
    .map((crumb) => crumb.title)
    .filter((title) => title !== 'Home')

  // Current page title (last breadcrumb)
  const pageTitle = filteredTitles[filteredTitles.length - 1] ?? ''

  // Build document title
  let documentTitle = APP_NAME
  if (filteredTitles.length > 0) {
    // Reverse order for document title (most specific first)
    documentTitle = `${filteredTitles.reverse().join(' - ')} | ${APP_NAME}`
  }

  // Set document title as side effect
  useEffect(() => {
    document.title = documentTitle
  }, [documentTitle])

  return {
    breadcrumbs,
    pageTitle,
    documentTitle,
  }
}
