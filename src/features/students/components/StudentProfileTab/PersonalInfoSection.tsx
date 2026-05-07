import { Avatar, Chip, Input, Label, TextField } from "@heroui/react"
import { useTranslation } from "react-i18next"

import FluentPerson16Filled from "~icons/fluent/person-16-filled"
import LucideUserRound from "~icons/lucide/user-round"

import type { Student } from "../../types"

interface PersonalInfoSectionProps {
	student: Student
}

const PersonalInfoSection = ({ student }: PersonalInfoSectionProps) => {
	const { i18n, t } = useTranslation()
	const fields = [
		{ key: "firstName", label: t("students.detail.profile.fields.firstName"), value: student.firstName },
		{ key: "lastName", label: t("students.detail.profile.fields.lastName"), value: student.lastName },
		{
			key: "birthday",
			label: t("students.detail.profile.fields.birthday"),
			value: student.birthday
				? new Date(student.birthday).toLocaleDateString(i18n.language, {
						month: "short",
						day: "numeric",
						year: "numeric",
					})
				: t("common.notAvailable"),
		},
		{
			key: "tags",
			label: t("students.detail.profile.fields.tags"),
			value: student.tags?.[0] ?? t("students.detail.profile.noTags"),
		},
		{
			key: "dietRestriction",
			label: t("students.detail.profile.fields.dietRestriction"),
			value: student.dietRestriction ?? t("students.detail.profile.noRestrictions"),
		},
		{
			key: "state",
			label: t("students.detail.profile.fields.state"),
			value: student.state ?? t("common.notAvailable"),
		},
		{ key: "city", label: t("students.detail.profile.fields.city"), value: student.city ?? t("common.notAvailable") },
		{
			key: "streetAddress",
			label: t("students.detail.profile.fields.streetAddress"),
			value: student.streetAddress ?? t("common.notAvailable"),
		},
		{
			key: "zipCode",
			label: t("students.detail.profile.fields.zipCode"),
			value: student.zipCode ?? t("common.notAvailable"),
		},
		{
			key: "enrollDate",
			label: t("students.detail.profile.fields.enrollDate"),
			value: student.enrollDate
				? new Date(student.enrollDate).toLocaleDateString(i18n.language, {
						month: "short",
						day: "numeric",
						year: "numeric",
					})
				: t("common.notAvailable"),
			className: "lg:col-span-2",
		},
	]

	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center gap-2 px-4 py-1.5">
				<LucideUserRound className="size-5 text-foreground" />
				<span className="font-semibold text-foreground text-sm">
					{t("students.detail.profile.sections.personalInfo")}
				</span>
			</div>

			<div className="flex flex-col gap-2">
				<Avatar className="size-11 shadow-sm">
					<Avatar.Image src={student.avatar?.path} alt={t("students.detail.profile.studentAvatarAlt")} />
					<Avatar.Fallback className="bg-accent text-white">
						<FluentPerson16Filled className="size-9 text-white" />
					</Avatar.Fallback>
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
					{(student.tags?.length ? student.tags : [t("students.detail.profile.noTags")]).map((tag) => (
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
