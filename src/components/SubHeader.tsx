import clsx from "clsx"

import usePageMetadata from "@/hooks/usePageMetadata"

interface SubHeaderProps {
	// Top row
	startSlot?: React.ReactNode // e.g., image/avatar/icon left of the title
	title?: React.ReactNode // override default breadcrumb title
	topExtraLeft?: React.ReactNode // inline next to title (e.g., tabs/pills)
	endSlot?: React.ReactNode // right side of top row (e.g., buttons/filters)

	// Bottom row
	bottomSlot?: React.ReactNode // full-width custom bottom row
	bottomLeft?: React.ReactNode // left side of bottom row
	bottomRight?: React.ReactNode // right side of bottom row

	// Content directly under the title (left column only)
	underTitle?: React.ReactNode
}

const SubHeader = ({
	bottomLeft,
	bottomRight,
	bottomSlot,
	endSlot,
	startSlot,
	title,
	topExtraLeft,
	underTitle,
}: SubHeaderProps) => {
	const { breadcrumbs } = usePageMetadata()
	const fallbackTitle = breadcrumbs[0]?.title
	const hasBottomRow = Boolean(bottomSlot ?? bottomLeft ?? bottomRight)
	const topMb = underTitle ? "mb-13" : "mb-7"

	return (
		<div>
			<div className="container mx-auto max-w-4xl px-4">
				<div className={clsx("flex items-center justify-between", topMb)}>
					<div className={clsx("flex gap-3", underTitle ? "items-start" : "items-center")}>
						{startSlot}
						<div>
							{title !== undefined ? (
								<h1 className="font-semibold lg:text-4xl">{title}</h1>
							) : (
								<h1 className="font-semibold lg:text-4xl">{fallbackTitle}</h1>
							)}
							{underTitle ? <div className="mt-3.5">{underTitle}</div> : null}
						</div>
						{topExtraLeft}
					</div>
					{endSlot}
				</div>

				{hasBottomRow &&
					(bottomSlot ? (
						<div className="flex items-center justify-between">{bottomSlot}</div>
					) : (
						<div className="flex items-center justify-between">
							<div>{bottomLeft}</div>
							<div>{bottomRight}</div>
						</div>
					))}
			</div>
		</div>
	)
}

export default SubHeader
