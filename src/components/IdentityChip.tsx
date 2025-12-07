import { Avatar, Chip } from "@heroui/react"

interface IdentityChipProps {
	fullName: string
	src?: string
}

const IdentityChip = ({ fullName, src }: IdentityChipProps) => {
	return (
		<Chip
			avatar={<Avatar className="size-5" name={fullName} showFallback src={src} />}
			classNames={{
				base: "bg-primary-50 px-3 py-1.5",
				content: "text-sm",
			}}
			variant="flat"
		>
			{fullName}
		</Chip>
	)
}

export default IdentityChip
