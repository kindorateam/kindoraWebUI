import { useRouterState } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'

import type { Breadcrumb, PageMetadata, RouteMatch } from '@/types/URL'

const APP_NAME = 'Kindora'

const usePageMetadata = (): PageMetadata => {
  const matches = useRouterState({
    select: (s) => s.matches as RouteMatch[],
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

  const pageTitle = useMemo(() => {
    return filteredTitles[filteredTitles.length - 1] ?? ''
  }, [filteredTitles])

  const documentTitle = useMemo(() => {
    let title = APP_NAME
    if (filteredTitles.length > 0) {
      // Create a copy before reversing to avoid mutating the original array
      title = `${[...filteredTitles].reverse().join(' - ')} | ${APP_NAME}`
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
