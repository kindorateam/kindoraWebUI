import { Avatar, Input, Label, TextField } from "@heroui/react"

import LucideUsers from "~icons/lucide/users"

import type { StudentGuardian } from "../../types"

interface GuardiansSectionProps {
	guardians: StudentGuardian[]
}

const GuardiansSection = ({ guardians }: GuardiansSectionProps) => {
	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center gap-2 px-4 py-1.5">
				<LucideUsers className="size-5 text-foreground" />
				<span className="font-semibold text-foreground text-sm">Guardians</span>
			</div>

			<div className="flex flex-col gap-6">
				{guardians.map((guardian) => (
					<div className="flex flex-col gap-2" key={guardian.id}>
						<Avatar className="size-11 shadow-sm">
							<Avatar.Image src={guardian.avatar?.path} alt={`${guardian.firstName} ${guardian.lastName}`} />
							<Avatar.Fallback>{`${guardian.firstName[0]}${guardian.lastName[0]}`}</Avatar.Fallback>
						</Avatar>

						<div className="grid gap-2 lg:grid-cols-3">
							<TextField variant="secondary" isReadOnly>
								<Label>First Name</Label>

								<Input value={guardian.firstName} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>Last Name</Label>

								<Input value={guardian.lastName} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>Relationship to student</Label>

								<Input value={guardian.relationshipToStudent ?? "N/A"} />
							</TextField>
							<TextField className="lg:col-span-2" variant="secondary" isReadOnly>
								<Label>Phone</Label>

								<Input value={guardian.phone ?? "N/A"} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>Pin</Label>

								<Input value={guardian.pin ?? "N/A"} />
							</TextField>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default GuardiansSection
