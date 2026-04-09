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
		<Chip className="bg-accent-soft" variant="soft">
			<Avatar className="size-5 shrink-0">
				{src ? <Avatar.Image alt={fullName} className="object-cover" src={src} /> : null}
				<Avatar.Fallback className={avatarFallbackClassName}>{icon}</Avatar.Fallback>
			</Avatar>
			<Chip.Label>{fullName}</Chip.Label>
		</Chip>
	)
}

export default IdentityChip
