import clsx from "clsx"

interface NumberBadgeProps extends React.ComponentProps<"div"> {
	value: number
	variant?: "default" | "circle"
}

const NumberBadge = ({ className, value, variant = "default", ...props }: NumberBadgeProps) => {
	const isCircle = variant === "circle"

	return (
		<div
			className={clsx(
				isCircle
					? "flex size-7 shrink-0 items-center justify-center rounded-full bg-[#792C410D]"
					: "w-7 rounded-lg bg-[#792C410D] text-center",
				className,
			)}
			{...props}
		>
			<span
				className={clsx(isCircle ? "font-semibold text-sm leading-none" : "font-semibold text-brand text-sm")}
				style={isCircle ? { color: "var(--colors-base-secondary, #7828C8)" } : undefined}
			>
				{value}
			</span>
		</div>
	)
}

export default NumberBadge
