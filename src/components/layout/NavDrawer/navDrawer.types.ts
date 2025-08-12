export interface NavDrawerItem {
  label: string
  path: string
  icon?: React.ReactNode
  badge?: number
  children?: NavDrawerItem[]
}
