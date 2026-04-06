import { Avatar, Chip } from "@heroui/react"

import FluentConferenceRoom20Regular from "~icons/fluent/conference-room-20-regular"
import FluentPerson16Filled from "~icons/fluent/person-16-filled"

interface IdentityChipProps {
	fallbackIcon?: "person" | "room"
	fullName: string
	src?: string
}

const IdentityChip = ({ fallbackIcon = "person", fullName, src }: IdentityChipProps) => {
	const icon =
		fallbackIcon === "room" ? (
			<FluentConferenceRoom20Regular className="size-4" />
		) : (
			<FluentPerson16Filled className="size-4 text-white" />
		)
	const avatarFallbackClassName =
		fallbackIcon === "room" ? "bg-primary text-primary-foreground" : "bg-accent text-white"

	return (
		<Chip className="bg-accent-soft px-3 py-1.5 text-sm" variant="soft">
			<div className="flex items-center gap-1.5">
				<Avatar className="h-5 w-5 shrink-0">
					{src ? <Avatar.Image alt={fullName} className="object-cover" src={src} /> : null}
					<Avatar.Fallback className={avatarFallbackClassName}>{icon}</Avatar.Fallback>
				</Avatar>
				<span>{fullName}</span>
			</div>
		</Chip>
	)
}

export default IdentityChip
