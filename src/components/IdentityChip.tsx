import { Avatar, Chip } from "@heroui/react"

interface IdentityChipProps {
	fullName: string
	src?: string
}

const IdentityChip = ({ fullName, src }: IdentityChipProps) => {
	return (
		<Chip
			avatar={<Avatar fallback name={fullName} src={src} />}
			className="hover:bg-brand/5 hover:text-brand text-xs"
			classNames={{
				base: "gap-2 ps-1.25 pe-3 py-1.25",
				content: "px-0 font-medium",
			}}
			size="lg"
			variant="flat"
		>
			{fullName}
		</Chip>
	)
}

export default IdentityChip
