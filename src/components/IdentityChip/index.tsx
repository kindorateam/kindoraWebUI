import { Avatar, Chip } from "@heroui/react"

import OouiUserAvatar from "~icons/ooui/user-avatar"

interface IdentityChipProps {
	fullName: string
	src?: string
}

const IdentityChip = ({ fullName, src }: IdentityChipProps) => {
	return (
		<Chip className="bg-primary-50 px-3 py-1.5 text-sm" variant="soft">
			<div className="flex items-center gap-1.5">
				<Avatar className="h-5 w-5 shrink-0 bg-[#1D6FE8] text-white">
					{src ? <Avatar.Image alt={fullName} className="object-cover" src={src} /> : null}
					<Avatar.Fallback className="text-white">
						<OouiUserAvatar className="size-3" />
					</Avatar.Fallback>
				</Avatar>
				<span>{fullName}</span>
			</div>
		</Chip>
	)
}

export default IdentityChip
