import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react"

import Text from "./Text"

interface InfoCardProps {
	title: string | React.ReactNode
	footer?: React.ReactNode // optional
	className?: string
	cardProps?: React.ComponentProps<typeof Card>
	headerProps?: React.ComponentProps<typeof CardHeader>
	bodyProps?: React.ComponentProps<typeof CardBody>
	footerProps?: React.ComponentProps<typeof CardFooter>
	children: React.ReactNode
}

export function InfoCard({
	title,
	footer,
	className,
	cardProps,
	headerProps,
	bodyProps,
	footerProps,
	children,
}: InfoCardProps) {
	return (
		<Card
			className={["gap-7 bg-black/2 p-6.5", className].filter(Boolean).join(" ")}
			classNames={{ base: "shadow-none rounded-[20px]" }}
			{...cardProps}
		>
			<CardHeader className="p-0" {...headerProps}>
				{typeof title === "string" ? (
					<Text as="h3" size={18} weight="semibold">
						{title}
					</Text>
				) : (
					title
				)}
			</CardHeader>

			<CardBody className="gap-7 p-0" {...bodyProps}>
				{children}
			</CardBody>

			{footer ? (
				<CardFooter className="p-0" {...footerProps}>
					{footer}
				</CardFooter>
			) : null}
		</Card>
	)
}

export default InfoCard
