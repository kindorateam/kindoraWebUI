import { Avatar, Input, Label, TextField } from "@heroui/react"
import { useTranslation } from "react-i18next"

import LucideUsers from "~icons/lucide/users"

import type { StudentGuardian } from "../../types"

interface GuardiansSectionProps {
	guardians: StudentGuardian[]
}

const GuardiansSection = ({ guardians }: GuardiansSectionProps) => {
	const { t } = useTranslation()

	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center gap-2 px-4 py-1.5">
				<LucideUsers className="size-5 text-foreground" />
				<span className="font-semibold text-foreground text-sm">{t("students.detail.profile.sections.guardians")}</span>
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
								<Label>{t("students.detail.profile.fields.firstName")}</Label>

								<Input value={guardian.firstName} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>{t("students.detail.profile.fields.lastName")}</Label>

								<Input value={guardian.lastName} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>{t("students.detail.profile.fields.relationshipToStudent")}</Label>

								<Input value={guardian.relationshipToStudent ?? t("common.notAvailable")} />
							</TextField>
							<TextField className="lg:col-span-2" variant="secondary" isReadOnly>
								<Label>{t("students.detail.profile.fields.phone")}</Label>

								<Input value={guardian.phone ?? t("common.notAvailable")} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>{t("students.detail.profile.fields.pin")}</Label>

								<Input value={guardian.pin ?? t("common.notAvailable")} />
							</TextField>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default GuardiansSection
