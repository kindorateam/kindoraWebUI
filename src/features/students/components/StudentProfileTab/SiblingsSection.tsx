import { Avatar, Input, Label, TextField } from "@heroui/react"
import { useTranslation } from "react-i18next"

import LucideUsers from "~icons/lucide/users"

import type { StudentSibling } from "../../types"

interface SiblingsSectionProps {
	siblings: StudentSibling[]
	fallbackRoomTitle?: string
}

const SiblingsSection = ({ siblings, fallbackRoomTitle }: SiblingsSectionProps) => {
	const { i18n, t } = useTranslation()

	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center gap-2 px-4 py-1.5">
				<LucideUsers className="size-5 text-foreground" />
				<span className="font-semibold text-foreground text-sm">{t("students.detail.profile.sections.siblings")}</span>
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
								<Label>{t("students.detail.profile.fields.firstName")}</Label>

								<Input value={sibling.firstName} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>{t("students.detail.profile.fields.lastName")}</Label>

								<Input value={sibling.lastName} />
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>{t("students.detail.profile.fields.relationshipToStudent")}</Label>

								<Input value={sibling.relationshipToStudent ?? t("common.notAvailable")} />
							</TextField>
							<TextField className="lg:col-span-2" variant="secondary" isReadOnly>
								<Label>{t("students.detail.profile.fields.dateOfBirth")}</Label>

								<Input
									value={
										sibling.dateOfBirth
											? new Date(sibling.dateOfBirth).toLocaleDateString(i18n.language, {
													month: "short",
													day: "numeric",
													year: "numeric",
												})
											: t("common.notAvailable")
									}
								/>
							</TextField>
							<TextField variant="secondary" isReadOnly>
								<Label>{t("students.detail.profile.fields.assignedRooms")}</Label>

								<Input
									value={sibling.assignedRoomTitle ?? fallbackRoomTitle ?? t("students.detail.profile.noRoomAssigned")}
								/>
							</TextField>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default SiblingsSection
