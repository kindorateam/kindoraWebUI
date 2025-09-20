import { BreadcrumbItem, Breadcrumbs as HeroUIBreadcrumbs } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { memo } from 'react'

import Text from './Text'
import usePageMetadata from '@/hooks/usePageMetadata'

const breadcrumbItemClasses = {
  separator: 'text-base text-neutral-500',
}

const Breadcrumbs = memo(() => {
  const { breadcrumbs, pageTitle } = usePageMetadata()

  const filteredBreadcrumbs = breadcrumbs.filter(
    (crumb) => crumb.title !== 'Home',
  )

  if (breadcrumbs.length === 0) return null

  if (filteredBreadcrumbs.length === 1) {
    return <div className="text-secondary-strong font-medium">{pageTitle}</div>
  }

  return (
    <HeroUIBreadcrumbs
      itemClasses={breadcrumbItemClasses}
      separator="/"
      variant="light"
    >
      {filteredBreadcrumbs.map((crumb, index) => (
        <BreadcrumbItem key={crumb.path}>
          {index === filteredBreadcrumbs.length - 1 ? (
            <Text color="neutral-600">{crumb.title}</Text>
          ) : (
            <Link to={crumb.path}>
              <Text color="neutral-500" weight="medium">
                {crumb.title}
              </Text>
            </Link>
          )}
        </BreadcrumbItem>
      ))}
    </HeroUIBreadcrumbs>
  )
})

Breadcrumbs.displayName = 'Breadcrumbs'

export default Breadcrumbs
