import { Avatar } from "@heroui/react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

import type { AddRoomFormData } from "../../types"

const ConfirmRoomStep = () => {
	const { t } = useTranslation()
	const { watch } = useFormContext<AddRoomFormData>()
	const formData = watch()

	const isGradient = formData.avatarPreview?.startsWith("linear-gradient")
	const formatAgeOptionLabel = (months: number | undefined) => {
		if (months === undefined) return t("common.notAvailable")

		const years = Math.floor(months / 12)
		const remainingMonths = months % 12

		if (years === 0) return t("rooms.age.months", { count: months })
		if (remainingMonths === 0) return t("rooms.age.years", { count: years })

		return t("rooms.age.yearsAndMonths", {
			months: t("rooms.age.months", { count: remainingMonths }),
			years: t("rooms.age.years", { count: years }),
		})
	}

	return (
		<div className="flex flex-col gap-6">
			<h2 className="font-medium text-foreground text-xl">{t("rooms.addRoom.confirm.title")}</h2>
			<div className="flex justify-center">
				{isGradient ? (
					<div className="size-14 rounded-full" style={{ background: formData.avatarPreview }} />
				) : (
					<Avatar className="size-14 text-lg">
						<Avatar.Image src={formData.avatarPreview ?? undefined} alt={formData.name} />
						<Avatar.Fallback>{formData.name?.charAt(0) ?? "R"}</Avatar.Fallback>
					</Avatar>
				)}
			</div>
			<div className="grid grid-cols-2 gap-x-6 gap-y-3">
				<div>
					<p className="text-muted text-sm">{t("rooms.addRoom.confirm.name")}</p>
					<p className="font-medium text-foreground">{formData.name}</p>
				</div>
				<div>
					<p className="text-muted text-sm">{t("rooms.addRoom.confirm.ageRange")}</p>
					<p className="font-medium text-foreground">
						{t("rooms.age.range", {
							max: formatAgeOptionLabel(formData.maxAge),
							min: formatAgeOptionLabel(formData.minAge),
						})}
					</p>
				</div>
				<div>
					<p className="text-muted text-sm">{t("rooms.addRoom.confirm.capacity")}</p>
					<p className="font-medium text-foreground">{formData.capacity}</p>
				</div>
				<div>
					<p className="text-muted text-sm">{t("rooms.addRoom.confirm.ratio")}</p>
					<p className="font-medium text-foreground">{formData.ratio}:1</p>
				</div>
				<div>
					<p className="text-muted text-sm">{t("rooms.addRoom.confirm.staff")}</p>
					<p className="font-medium text-foreground">
						{t("rooms.addRoom.confirm.selected", { count: formData.staffIds?.length || 0 })}
					</p>
				</div>
				<div>
					<p className="text-muted text-sm">{t("rooms.addRoom.confirm.students")}</p>
					<p className="font-medium text-foreground">
						{t("rooms.addRoom.confirm.selected", { count: formData.studentIds?.length || 0 })}
					</p>
				</div>
			</div>
		</div>
	)
}

export default ConfirmRoomStep
