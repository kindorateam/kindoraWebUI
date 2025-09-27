export interface Breadcrumb {
	title: string
	path: string
	isLast: boolean
}

export interface PageMetadata {
	breadcrumbs: Breadcrumb[]
	pageTitle: string
	documentTitle: string
}

interface RouteContext {
	breadcrumb?: string
	[key: string]: unknown
}

export interface RouteMatch {
	pathname: string
	context?: RouteContext
	[key: string]: unknown
}
