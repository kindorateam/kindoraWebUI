import { Avatar, Chip, Input, Label, TextField } from "@heroui/react"

import LucideUserRound from "~icons/lucide/user-round"

import type { Student } from "../../types"

interface PersonalInfoSectionProps {
	student: Student
}

const PersonalInfoSection = ({ student }: PersonalInfoSectionProps) => {
	const fields = [
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
					{fields.map((field) => (
						<TextField key={field.key} className={field.className} variant="secondary" isReadOnly>
							<Label>{field.label}</Label>
							<Input value={field.value} />
						</TextField>
					))}
				</div>

				<div className="flex flex-wrap gap-2">
					{(student.tags?.length ? student.tags : ["No tags"]).map((tag) => (
						<Chip className="bg-primary-50" key={tag} size="sm" variant="soft">
							{tag}
						</Chip>
					))}
				</div>
			</div>
		</section>
	)
}

export default PersonalInfoSection
