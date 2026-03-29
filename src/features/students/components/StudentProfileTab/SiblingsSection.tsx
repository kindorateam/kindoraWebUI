import { Avatar, Input, Label, TextField } from "@heroui/react"

import LucideUsers from "~icons/lucide/users"

import type { StudentSibling } from "../../types"

interface SiblingsSectionProps {
	siblings: StudentSibling[]
	fallbackRoomTitle?: string
}

const SiblingsSection = ({ siblings, fallbackRoomTitle }: SiblingsSectionProps) => {
	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center gap-2 px-4 py-1.5">
				<LucideUsers className="size-5 text-foreground" />
				<span className="font-semibold text-foreground text-sm">Sibling</span>
			</div>

			<div className="flex flex-col gap-6">
				{siblings.map((sibling) => (
					<div className="flex flex-col gap-2" key={sibling.id}>
						<Avatar className="size-11 shadow-sm">
							<Avatar.Image src={sibling.avatar?.path} alt={`${sibling.firstName} ${sibling.lastName}`} />
							<Avatar.Fallback>{`${sibling.firstName[0]}${sibling.lastName[0]}`}</Avatar.Fallback>
						</Avatar>

						<div className="grid gap-2 lg:grid-cols-3">
							<TextField variant="secondary" isReadOnly>
								<Label>First Name</Label>

								<Input value={sibling.firstName} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>Last Name</Label>

								<Input value={sibling.lastName} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>Relationship to student</Label>

								<Input value={sibling.relationshipToStudent ?? "N/A"} />
							</TextField>
							<TextField className="lg:col-span-2" variant="secondary" isReadOnly>
								<Label>Date of Birth</Label>

								<Input
									value={
										sibling.dateOfBirth
											? new Date(sibling.dateOfBirth).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												})
											: "N/A"
									}
								/>
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>Assigned rooms</Label>

								<Input value={sibling.assignedRoomTitle ?? fallbackRoomTitle ?? "No room assigned"} />
							</TextField>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default SiblingsSection
