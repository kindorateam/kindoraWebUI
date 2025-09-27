import { Chip as HeroUIChip } from "@heroui/react"
import clsx from "clsx"

import type { ChipProps } from "@heroui/react"

const Chip = (props: ChipProps) => {
	return (
		<HeroUIChip
			{...props}
			className={clsx(props.className, "bg-black/5 px-2 py-1 hover:bg-brand/5 hover:text-brand")}
			classNames={{ content: "p-0" }}
			radius="sm"
		>
			{props.children}
		</HeroUIChip>
	)
}

export default Chip
