import Text from "@/components/Text"

import type { ReactNode } from "react"

interface InlineStatProps {
	icon: ReactNode
	count: number
	label: string // used for screen readers/tooltips
}

export const InlineStat = ({ icon, count, label }: InlineStatProps) => (
	<span className="inline-flex items-center gap-2" title={label}>
		<span aria-hidden="true">{icon}</span>
		<Text color="neutral-800" size={12} weight="bold">
			<span className="sr-only">{`${label}: `}</span>
			{count}
		</Text>
	</span>
)

export default InlineStat
