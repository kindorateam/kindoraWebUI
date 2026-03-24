import { Avatar, Card, Chip, Input } from "@heroui/react"

import JamMedical from "~icons/jam/medical"
import LucideUserRound from "~icons/lucide/user-round"
import LucideUsers from "~icons/lucide/users"

import type { Student } from "../../types"

interface StudentProfileTabProps {
	student: Student
}

const readOnlyFieldClassNames = {
	inputWrapper: "bg-default-100 shadow-sm data-[hover=true]:bg-default-100 group-data-[focus=true]:bg-default-100",
	input: "text-sm",
	label: "text-xs text-default-600",
}

const StudentProfileTab = ({ student }: StudentProfileTabProps) => {
	const personalInfoFields = [
		{ key: "firstName", label: "First Name", value: student.firstName },
		{ key: "lastName", label: "Last Name", value: student.lastName },
		{
			key: "birthday",
			label: "Birthday",
			value: student.birthday
				? new Date(student.birthday).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})
				: "N/A",
		},
		{ key: "tags", label: "Tags", value: student.tags?.[0] ?? "No tags" },
		{ key: "dietRestriction", label: "Diet Restriction", value: student.dietRestriction ?? "No restrictions" },
		{ key: "state", label: "State", value: student.state ?? "N/A" },
		{ key: "city", label: "City", value: student.city ?? "N/A" },
		{ key: "streetAddress", label: "Street address", value: student.streetAddress ?? "N/A" },
		{ key: "zipCode", label: "ZIP code", value: student.zipCode ?? "N/A" },
		{
			key: "enrollDate",
			label: "Inroll date",
			value: student.enrollDate
				? new Date(student.enrollDate).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})
				: "N/A",
			className: "lg:col-span-2",
		},
	]

	return (
		<Card className="p-5" radius="md" shadow="sm">
			<Card.Content className="gap-10 p-0">
				<section className="flex flex-col gap-6">
					<div className="flex items-center gap-2 px-4 py-1.5">
						<LucideUserRound className="size-5 text-foreground" />
						<span className="font-semibold text-foreground text-sm">Personal info</span>
					</div>

					<div className="flex flex-col gap-2">
						<Avatar className="size-11 shadow-sm">
							<Avatar.Image src={student.avatar?.path} alt="Student avatar" />
							<Avatar.Fallback />
						</Avatar>

						<div className="grid gap-2 lg:grid-cols-3">
							{personalInfoFields.map((field) => (
								<Input
									className={field.className}
									classNames={readOnlyFieldClassNames}
									isReadOnly
									key={field.key}
									label={field.label}
									radius="md"
									size="sm"
									value={field.value}
									variant="flat"
								/>
							))}
						</div>

						<div className="flex flex-wrap gap-2">
							{(student.tags?.length ? student.tags : ["No tags"]).map((tag) => (
								<Chip className="bg-primary-50" key={tag} size="sm" variant="flat">
									{tag}
								</Chip>
							))}
						</div>
					</div>
				</section>

				<section className="flex flex-col gap-6">
					<div className="flex items-center gap-2 px-4 py-1.5">
						<LucideUsers className="size-5 text-foreground" />
						<span className="font-semibold text-foreground text-sm">Parents</span>
					</div>

					<div className="flex flex-col gap-6">
						{(student.parents ?? []).map((parent) => (
							<div className="flex flex-col gap-2" key={parent.id}>
								<Avatar className="size-11 shadow-sm">
									<Avatar.Image src={parent.avatar?.path} alt={`${parent.firstName} ${parent.lastName}`} />
									<Avatar.Fallback>{`${parent.firstName[0]}${parent.lastName[0]}`}</Avatar.Fallback>
								</Avatar>

								<div className="grid gap-2 lg:grid-cols-3">
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="First Name"
										radius="md"
										size="sm"
										value={parent.firstName}
										variant="flat"
									/>
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="Last Name"
										radius="md"
										size="sm"
										value={parent.lastName}
										variant="flat"
									/>
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="Relationship to student"
										radius="md"
										size="sm"
										value={parent.relationshipToStudent ?? "N/A"}
										variant="flat"
									/>
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="Email"
										radius="md"
										size="sm"
										value={parent.email ?? "N/A"}
										variant="flat"
									/>
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="Phone"
										radius="md"
										size="sm"
										value={parent.phone ?? "N/A"}
										variant="flat"
									/>
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="Pin"
										radius="md"
										size="sm"
										value={parent.pin ?? "N/A"}
										variant="flat"
									/>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="flex flex-col gap-6">
					<div className="flex items-center gap-2 px-4 py-1.5">
						<LucideUsers className="size-5 text-foreground" />
						<span className="font-semibold text-foreground text-sm">Sibling</span>
					</div>

					<div className="flex flex-col gap-6">
						{(student.siblings ?? []).map((sibling) => (
							<div className="flex flex-col gap-2" key={sibling.id}>
								<Avatar className="size-11 shadow-sm">
									<Avatar.Image src={sibling.avatar?.path} alt={`${sibling.firstName} ${sibling.lastName}`} />
									<Avatar.Fallback>{`${sibling.firstName[0]}${sibling.lastName[0]}`}</Avatar.Fallback>
								</Avatar>

								<div className="grid gap-2 lg:grid-cols-3">
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="First Name"
										radius="md"
										size="sm"
										value={sibling.firstName}
										variant="flat"
									/>
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="Last Name"
										radius="md"
										size="sm"
										value={sibling.lastName}
										variant="flat"
									/>
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="Relationship to student"
										radius="md"
										size="sm"
										value={sibling.relationshipToStudent ?? "N/A"}
										variant="flat"
									/>
									<Input
										className="lg:col-span-2"
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="Date of Birth"
										radius="md"
										size="sm"
										value={
											sibling.dateOfBirth
												? new Date(sibling.dateOfBirth).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
													})
												: "N/A"
										}
										variant="flat"
									/>
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="Assigned rooms"
										radius="md"
										size="sm"
										value={sibling.assignedRoomTitle ?? student.room?.title ?? "No room assigned"}
										variant="flat"
									/>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="flex flex-col gap-6">
					<div className="flex items-center gap-2 px-4 py-1.5">
						<LucideUsers className="size-5 text-foreground" />
						<span className="font-semibold text-foreground text-sm">Guardians</span>
					</div>

					<div className="flex flex-col gap-6">
						{(student.guardians ?? []).map((guardian) => (
							<div className="flex flex-col gap-2" key={guardian.id}>
								<Avatar className="size-11 shadow-sm">
									<Avatar.Image src={guardian.avatar?.path} alt={`${guardian.firstName} ${guardian.lastName}`} />
									<Avatar.Fallback>{`${guardian.firstName[0]}${guardian.lastName[0]}`}</Avatar.Fallback>
								</Avatar>

								<div className="grid gap-2 lg:grid-cols-3">
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="First Name"
										radius="md"
										size="sm"
										value={guardian.firstName}
										variant="flat"
									/>
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="Last Name"
										radius="md"
										size="sm"
										value={guardian.lastName}
										variant="flat"
									/>
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="Relationship to student"
										radius="md"
										size="sm"
										value={guardian.relationshipToStudent ?? "N/A"}
										variant="flat"
									/>
									<Input
										className="lg:col-span-2"
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="Phone"
										radius="md"
										size="sm"
										value={guardian.phone ?? "N/A"}
										variant="flat"
									/>
									<Input
										classNames={readOnlyFieldClassNames}
										isReadOnly
										label="Pin"
										radius="md"
										size="sm"
										value={guardian.pin ?? "N/A"}
										variant="flat"
									/>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="flex flex-col gap-6">
					<div className="flex items-center gap-2 px-4 py-1.5">
						<JamMedical className="size-5 text-foreground" />
						<span className="font-semibold text-foreground text-sm">Medical info</span>
					</div>

					<div className="grid gap-2 lg:grid-cols-2">
						<Input
							classNames={readOnlyFieldClassNames}
							isReadOnly
							label="Allergies"
							radius="md"
							size="sm"
							value={student.medicalInfo?.allergies?.[0] ?? "No allergies"}
							variant="flat"
						/>
						<Input
							classNames={readOnlyFieldClassNames}
							isReadOnly
							label="Medications"
							radius="md"
							size="sm"
							value={student.medicalInfo?.medications ?? "-"}
							variant="flat"
						/>
						<div className="flex flex-wrap gap-2 lg:col-span-2">
							{(student.medicalInfo?.allergies?.length ? student.medicalInfo.allergies : ["No allergies"]).map(
								(allergy) => (
									<Chip className="bg-primary-50" key={allergy} size="sm" variant="flat">
										{allergy}
									</Chip>
								),
							)}
						</div>
						<Input
							classNames={readOnlyFieldClassNames}
							isReadOnly
							label="Doctor"
							radius="md"
							size="sm"
							value={student.medicalInfo?.doctor ?? "N/A"}
							variant="flat"
						/>
						<Input
							classNames={readOnlyFieldClassNames}
							isReadOnly
							label="Doctor Phone"
							radius="md"
							size="sm"
							value={student.medicalInfo?.doctorPhone ?? "N/A"}
							variant="flat"
						/>
					</div>
				</section>
			</Card.Content>
		</Card>
	)
}

export default StudentProfileTab
