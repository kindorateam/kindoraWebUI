import { Avatar, Chip } from "@heroui/react"

import OouiUserAvatar from "~icons/ooui/user-avatar"

interface IdentityChipProps {
	fullName: string
	src?: string
}

const IdentityChip = ({ fullName, src }: IdentityChipProps) => {
	return (
		<Chip
			avatar={
				<Avatar
					classNames={{
						base: "h-8 w-8 bg-[#1D6FE8] text-white",
						fallback: "text-white",
						icon: "h-full w-full",
						img: "object-cover",
					}}
					fallback={<OouiUserAvatar className="size-4" />}
					name={fullName}
					showFallback
					size="sm"
					src={src}
				/>
			}
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
