import type React from "react"

export interface NavDrawerItem {
	labelKey: string
	path: string
	icon?: React.ReactNode
	badge?: number
	children?: NavDrawerItem[]
}
