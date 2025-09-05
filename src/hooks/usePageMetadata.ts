import { useRouterState } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'

import type { Breadcrumb, PageMetadata, RouteMatch } from '@/types/URL'

const APP_NAME = 'Kindora'

const usePageMetadata = (): PageMetadata => {
  const matches = useRouterState({
    // matches is a union from TanStack Router; cast to the shape we read
    select: (s) => s.matches as unknown as RouteMatch[],
  })

  const breadcrumbs: Breadcrumb[] = useMemo(() => {
    return matches.reduce<Breadcrumb[]>((acc, match, index) => {
      if (match.context && typeof match.context.breadcrumb === 'string') {
        // Deduplicate breadcrumbs with same title
        const existingCrumb = acc.find(
          (crumb) => crumb.title === match.context?.breadcrumb,
        )
        if (!existingCrumb) {
          acc.push({
            title: match.context.breadcrumb,
            path: match.pathname,
            isLast: index === matches.length - 1,
          })
        }
      }
      return acc
    }, [])
  }, [matches])

  const filteredTitles = useMemo(() => {
    return breadcrumbs
      .map((crumb) => crumb.title)
      .filter((title) => title !== 'Home')
  }, [breadcrumbs])

  const pageTitle = filteredTitles[filteredTitles.length - 1] ?? ''

  const documentTitle = useMemo(() => {
    let title = APP_NAME
    if (filteredTitles.length > 0) {
      // Show only the latest breadcrumb part, not the full path
      title = `${filteredTitles[filteredTitles.length - 1]} | ${APP_NAME}`
    }
    return title
  }, [filteredTitles])

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
