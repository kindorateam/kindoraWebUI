import { Avatar, Input, Label, TextField } from "@heroui/react"
import { useTranslation } from "react-i18next"

import LucideUsers from "~icons/lucide/users"

import type { StudentParent } from "../../types"

interface ParentsSectionProps {
	parents: StudentParent[]
}

const ParentsSection = ({ parents }: ParentsSectionProps) => {
	const { t } = useTranslation()

	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center gap-2 px-4 py-1.5">
				<LucideUsers className="size-5 text-foreground" />
				<span className="font-semibold text-foreground text-sm">{t("students.detail.profile.sections.parents")}</span>
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
								<Label>{t("students.detail.profile.fields.firstName")}</Label>

								<Input value={parent.firstName} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>{t("students.detail.profile.fields.lastName")}</Label>

								<Input value={parent.lastName} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>{t("students.detail.profile.fields.relationshipToStudent")}</Label>

								<Input value={parent.relationshipToStudent ?? t("common.notAvailable")} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>{t("students.detail.profile.fields.email")}</Label>

								<Input value={parent.email ?? t("common.notAvailable")} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>{t("students.detail.profile.fields.phone")}</Label>

								<Input value={parent.phone ?? t("common.notAvailable")} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>{t("students.detail.profile.fields.pin")}</Label>

								<Input value={parent.pin ?? t("common.notAvailable")} />
							</TextField>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default ParentsSection
