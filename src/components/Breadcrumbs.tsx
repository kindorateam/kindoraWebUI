import { BreadcrumbItem, Breadcrumbs as HeroUIBreadcrumbs } from '@heroui/react'
import { Link } from '@tanstack/react-router'

import { usePageMetadata } from '@/hooks/usePageMetadata'

const Breadcrumbs = () => {
  const { breadcrumbs, pageTitle } = usePageMetadata()

  if (breadcrumbs.length === 0) return null

  // Filter out "Home" from breadcrumbs
  const filteredBreadcrumbs = breadcrumbs.filter(
    (crumb) => crumb.title !== 'Home',
  )

  // If only one breadcrumb after filtering (top-level route), show just the title
  if (filteredBreadcrumbs.length === 1) {
    return <div className="text-grey3 font-semibold">{pageTitle}</div>
  }

  // For nested routes, show full breadcrumb trail
  return (
    <HeroUIBreadcrumbs
      classNames={{
        list: 'gap-2',
      }}
      itemClasses={{
        item: 'text-sm',
        separator: 'text-default-400',
      }}
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
}

export default Breadcrumbs
