import { useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'

import type { Breadcrumb, PageMetadata, RouteMatch } from '@/types/URL'

const APP_NAME = 'Kindora'

const usePageMetadata = (): PageMetadata => {
  const matches = useRouterState({
    select: (s) => s.matches as RouteMatch[],
  })

  const breadcrumbs: Breadcrumb[] = matches.reduce<Breadcrumb[]>(
    (acc, match, index) => {
      if (match.context && typeof match.context.breadcrumb === 'string') {
        acc.push({
          title: match.context.breadcrumb,
          path: match.pathname,
          isLast: index === matches.length - 1,
        })
      }
      return acc
    },
    [],
  )

  const filteredTitles = breadcrumbs
    .map((crumb) => crumb.title)
    .filter((title) => title !== 'Home')

  const pageTitle = filteredTitles[filteredTitles.length - 1] ?? ''

  let documentTitle = APP_NAME
  if (filteredTitles.length > 0) {
    documentTitle = `${filteredTitles.reverse().join(' - ')} | ${APP_NAME}`
  }

  useEffect(() => {
    document.title = documentTitle
  }, [documentTitle])

  return {
    breadcrumbs,
    pageTitle,
    documentTitle,
  }
}

export default usePageMetadata
