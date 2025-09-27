import { Button as HeroButton, extendVariants } from "@heroui/react"

const Button = extendVariants(HeroButton, {
	variants: {
		color: {
			primary: "bg-brand text-white data-[hover=true]:bg-brand-hover data-[pressed=true]:bg-brand-active",
			secondary:
				"border border-black/10 bg-transparent text-neutral-800 data-[hover=true]:bg-black/5 data-[pressed=true]:bg-black/10",
			text: "min-w-auto h-auto border-none p-0 bg-transparent text-brand text-xs font-semibold",
		},
	},
	defaultVariants: {
		color: "primary",
		size: "md",
	},
	compoundVariants: [
		{
			color: ["primary", "secondary"],
			class: "font-medium rounded-[14px] py-2.5 px-5 data-[hover=true]:opacity-100!",
		},
	],
})

export default Button
