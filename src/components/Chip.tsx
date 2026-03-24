import { Chip as HeroUIChip } from "@heroui/react"
import { clsx } from "clsx"

import type { ChipProps } from "@heroui/react"

const Chip = ({ className, children, ...props }: ChipProps) => {
	return (
		<HeroUIChip
			{...props}
			className={clsx("rounded-sm bg-black/5 px-2 py-1 hover:bg-brand/5 hover:text-brand", className)}
		>
			{children}
		</HeroUIChip>
	)
}

export default Chip
