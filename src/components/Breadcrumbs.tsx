import { BreadcrumbItem, Breadcrumbs as HeroUIBreadcrumbs } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { memo, useMemo } from 'react'

import usePageMetadata from '@/hooks/usePageMetadata'

const breadcrumbClassNames = {
  list: 'gap-2',
}

const breadcrumbItemClasses = {
  item: 'text-sm',
  separator: 'text-default-400',
}

const Breadcrumbs = memo(() => {
  const { breadcrumbs, pageTitle } = usePageMetadata()

  const filteredBreadcrumbs = useMemo(() => {
    return breadcrumbs.filter((crumb) => crumb.title !== 'Home')
  }, [breadcrumbs])

  if (breadcrumbs.length === 0) return null

  if (filteredBreadcrumbs.length === 1) {
    return <div className="text-gray3 font-medium">{pageTitle}</div>
  }

  return (
    <HeroUIBreadcrumbs
      classNames={breadcrumbClassNames}
      itemClasses={breadcrumbItemClasses}
      separator="/"
      variant="light"
    >
      {filteredBreadcrumbs.map((crumb, index) => (
        <BreadcrumbItem key={crumb.path}>
          {index === filteredBreadcrumbs.length - 1 ? (
            <span className="text-default-700 font-medium">{crumb.title}</span>
          ) : (
            <Link
              className="text-default-500 hover:text-default-700 transition-colors"
              to={crumb.path}
            >
              {crumb.title}
            </Link>
          )}
        </BreadcrumbItem>
      ))}
    </HeroUIBreadcrumbs>
  )
})

Breadcrumbs.displayName = 'Breadcrumbs'

export default Breadcrumbs
