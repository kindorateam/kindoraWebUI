import { Card } from "@heroui/react"

import Text from "./Text"

interface StaffCardProps {
	title: string | React.ReactNode
	footer?: React.ReactNode // optional
	className?: string
	cardProps?: React.ComponentProps<typeof Card>
	headerProps?: React.ComponentProps<typeof Card.Header>
	bodyProps?: React.ComponentProps<typeof Card.Content>
	footerProps?: React.ComponentProps<typeof Card.Footer>
	children: React.ReactNode
}

const StaffCard = ({
	title,
	footer,
	className,
	cardProps,
	headerProps,
	bodyProps,
	footerProps,
	children,
}: StaffCardProps) => {
	return (
		<Card
			className={["gap-7 rounded-[20px] bg-black/2 p-6.5 shadow-none", className].filter(Boolean).join(" ")}
			{...cardProps}
		>
			<Card.Header className="p-0" {...headerProps}>
				{typeof title === "string" ? (
					<Text as="h3" size={18} weight="semibold">
						{title}
					</Text>
				) : (
					title
				)}
			</Card.Header>

			<Card.Content className="gap-5 p-0" {...bodyProps}>
				{children}
			</Card.Content>

			{footer ? (
				<Card.Footer className="p-0" {...footerProps}>
					{footer}
				</Card.Footer>
			) : null}
		</Card>
	)
}

export default StaffCard
