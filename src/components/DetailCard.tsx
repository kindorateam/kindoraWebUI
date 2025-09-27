import { Avatar, Link } from "@heroui/react"
import { Fragment } from "react"

import Text from "./Text"

const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ")

interface DetailCard {
	id: string
	label: React.ReactNode
	value: React.ReactNode
	href?: string
}

type AvatarProps =
	| {
			name?: string
			src?: string
			size?: "sm" | "md" | "lg"
			className?: string
	  }
	| null
	| undefined

interface DetailCardProps {
	avatar?: AvatarProps
	title?: React.ReactNode
	rows?: DetailCard[]
	headerAside?: React.ReactNode
	className?: string
	contentClassName?: string
	labelColWidth?: string // e.g. "80px", "6rem". Defaults to "56px"
}

const DetailCard = ({ avatar, title, rows = [], headerAside, className, contentClassName }: DetailCardProps) => {
	const hasAvatar = !!avatar
	const hasTitle = !!title

	return (
		<div className={cn(hasAvatar ? "flex gap-3.5" : "block", className)}>
			{hasAvatar && (
				<div>
					<Avatar className={avatar?.className} name={avatar?.name} size={avatar?.size ?? "md"} src={avatar?.src} />
				</div>
			)}

			<div className={cn(hasAvatar && "pt-2.5", contentClassName)}>
				{(hasTitle || headerAside) && (
					<div className="mb-2.5 flex items-start justify-between gap-2">
						{hasTitle ? (
							typeof title === "string" ? (
								<Text as="h4" weight="semibold">
									{title}
								</Text>
							) : (
								title
							)
						) : (
							<span />
						)}
						{headerAside}
					</div>
				)}

				{rows.length > 0 && (
					<dl className={cn("grid grid-cols-[max-content_1fr] items-center gap-x-2.5 gap-y-2")}>
						{rows.map((r) => {
							const valueContent = r.href ? <Link href={r.href}>{r.value}</Link> : r.value

							return (
								<Fragment key={r.id}>
									<dt>
										<Text as="span" color="neutral-500" size={12} weight="regular">
											{r.label}
										</Text>
									</dt>
									<dd>{valueContent}</dd>
								</Fragment>
							)
						})}
					</dl>
				)}
			</div>
		</div>
	)
}

export default DetailCard
