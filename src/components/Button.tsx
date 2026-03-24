import { Button as HeroButton } from "@heroui/react"
import { clsx } from "clsx"

import type { ButtonProps as HeroButtonProps } from "@heroui/react"

type CustomColor = "primary" | "secondary" | "text"

interface ButtonProps extends Omit<HeroButtonProps, "color"> {
	color?: CustomColor
}

const colorClasses: Record<CustomColor, string> = {
	primary:
		"bg-brand text-white hover:bg-brand-hover active:bg-brand-active font-medium rounded-[14px] py-2.5 px-5 hover:opacity-100!",
	secondary:
		"border border-black/10 bg-transparent text-neutral-800 hover:bg-black/5 active:bg-black/10 font-medium rounded-[14px] py-2.5 px-5 hover:opacity-100!",
	text: "min-w-auto h-auto border-none p-0 bg-transparent text-brand text-xs font-semibold",
}

const Button = ({ color = "primary", className, ...props }: ButtonProps) => {
	return <HeroButton className={clsx(colorClasses[color], className)} size="md" {...props} />
}

export default Button
