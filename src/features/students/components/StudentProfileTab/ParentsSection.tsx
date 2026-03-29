import { Avatar, Input, Label, TextField } from "@heroui/react"

import LucideUsers from "~icons/lucide/users"

import type { StudentParent } from "../../types"

interface ParentsSectionProps {
	parents: StudentParent[]
}

const ParentsSection = ({ parents }: ParentsSectionProps) => {
	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center gap-2 px-4 py-1.5">
				<LucideUsers className="size-5 text-foreground" />
				<span className="font-semibold text-foreground text-sm">Parents</span>
			</div>

			<div className="flex flex-col gap-6">
				{parents.map((parent) => (
					<div className="flex flex-col gap-2" key={parent.id}>
						<Avatar className="size-11 shadow-sm">
							<Avatar.Image src={parent.avatar?.path} alt={`${parent.firstName} ${parent.lastName}`} />
							<Avatar.Fallback>{`${parent.firstName[0]}${parent.lastName[0]}`}</Avatar.Fallback>
						</Avatar>

						<div className="grid gap-2 lg:grid-cols-3">
							<TextField variant="secondary" isReadOnly>
								<Label>First Name</Label>

								<Input value={parent.firstName} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>Last Name</Label>

								<Input value={parent.lastName} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>Relationship to student</Label>

								<Input value={parent.relationshipToStudent ?? "N/A"} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>Email</Label>

								<Input value={parent.email ?? "N/A"} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>Phone</Label>

								<Input value={parent.phone ?? "N/A"} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>Pin</Label>

								<Input value={parent.pin ?? "N/A"} />
							</TextField>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default ParentsSection
