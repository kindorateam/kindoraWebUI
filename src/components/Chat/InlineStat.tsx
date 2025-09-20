import { type ReactNode } from 'react'

import Text from '@/components/Text'

interface InlineStatProps {
  icon: ReactNode
  count: number
  label: string // used for screen readers/tooltips
}

export const InlineStat = ({ icon, count, label }: InlineStatProps) => (
  <span
    aria-label={`${label}: ${count}`}
    className="inline-flex items-center gap-2"
    title={label}
  >
    <span>{icon}</span>
    <Text color="neutral-800" size={12} weight="bold">
      {count}
    </Text>
  </span>
)

export default InlineStat
