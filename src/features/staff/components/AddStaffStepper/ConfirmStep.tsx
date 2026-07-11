import { Switch } from "@heroui/react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

import EosIconsRoleBindingOutlined from "~icons/eos-icons/role-binding-outlined"
import JamMedical from "~icons/jam/medical"
import LucideUserRound from "~icons/lucide/user-round"
import SolarCalendarBroken from "~icons/solar/calendar-broken"
import StreamlineUltimateEmergencyCall from "~icons/streamline-ultimate/emergency-call"
import TablerCertificate from "~icons/tabler/certificate"

import { DEGREE_OPTIONS, MOCK_ROOMS, RELATIONSHIP_OPTIONS, STAFF_ROLES, US_STATES, WORKING_DAYS } from "../../constants"

import type { TFunction } from "i18next"
import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const SectionHeader = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
	<div className="flex w-full items-center gap-2.5 bg-default-100 p-1.5">
		{icon}
		<span className="font-semibold text-foreground text-sm">{label}</span>
	</div>
)

const DetailRow = ({ label, value }: { label: string; value?: string }) => (
	<div className="flex items-center gap-2 text-base">
		<span className="font-medium text-foreground">{label}:</span>
		<span className="text-neutral-700">{value || "--"}</span>
	</div>
)

const resolveLabel = (
	key: string | undefined,
	options: readonly { key: string; label: string; labelKey?: string }[],
	t: TFunction,
): string => {
	if (!key) return "--"
	const option = options.find((o) => o.key === key)
	if (!option) return key
	return option.labelKey ? t(option.labelKey) : option.label
}

const ConfirmStep = () => {
	const { t } = useTranslation()
	const { watch, control } = useFormContext<AddStaffFormData>()
	const data = watch()

	const roleName = resolveLabel(data.role, STAFF_ROLES, t)
	const degreeName = resolveLabel(data.degree, DEGREE_OPTIONS, t)
	const stateName = resolveLabel(data.state, US_STATES, t)
	const relationshipName = resolveLabel(data.emergencyContactRelationship, RELATIONSHIP_OPTIONS, t)

	const roomNames = data.assignedRooms?.map((r) => resolveLabel(r, MOCK_ROOMS, t)).join(", ") || "--"

	const workingDayNames =
		data.workingDays
			?.slice()
			.sort((a, b) => WORKING_DAYS.findIndex((d) => d.key === a) - WORKING_DAYS.findIndex((d) => d.key === b))
			.map((d) => resolveLabel(d, WORKING_DAYS, t))
			.join(", ") || "--"

	return (
		<div className="flex flex-col gap-6">
			<h2 className="font-medium text-xl">{t("staff.addStaff.confirm.title")}</h2>

			{/* Personal Info */}
			<div className="flex flex-col gap-3">
				<SectionHeader
					icon={<LucideUserRound className="size-5 text-foreground" />}
					label={t("staff.profile.sections.personalInfo")}
				/>
				<div className="grid grid-cols-3 gap-x-8 gap-y-3">
					<DetailRow label={t("staff.profile.fields.firstName")} value={data.firstName} />
					<DetailRow label={t("staff.profile.fields.lastName")} value={data.lastName} />
					<DetailRow label={t("staff.profile.fields.phone")} value={data.phone} />
					<DetailRow label={t("staff.profile.fields.email")} value={data.email} />
					<DetailRow label={t("staff.profile.fields.role")} value={roleName} />
					<DetailRow label={t("staff.profile.fields.birthday")} value={data.birthday} />
					<DetailRow label={t("staff.profile.fields.state")} value={stateName} />
					<DetailRow label={t("staff.profile.fields.zipCode")} value={data.zipCode} />
					<DetailRow label={t("staff.profile.fields.city")} value={data.city} />
					<DetailRow label={t("staff.profile.fields.streetAddress")} value={data.streetAddress} />
					<DetailRow label={t("staff.profile.fields.notes")} value={data.notes} />
				</div>
			</div>

			{/* Certification */}
			<div className="flex flex-col gap-3">
				<SectionHeader
					icon={<TablerCertificate className="size-5 text-foreground" />}
					label={t("staff.profile.sections.certification")}
				/>
				<div className="grid grid-cols-2 gap-3">
					<DetailRow label={t("staff.profile.fields.degree")} value={degreeName} />
					<DetailRow label={t("staff.profile.fields.certification")} value={data.certification} />
				</div>
			</div>

			{/* Kindora role & status */}
			<div className="flex flex-col gap-3">
				<SectionHeader
					icon={<EosIconsRoleBindingOutlined className="size-5 text-foreground" />}
					label={t("staff.profile.sections.kindoraRole")}
				/>
				<div className="grid grid-cols-3 gap-x-8 gap-y-3">
					<DetailRow label={t("staff.profile.fields.role")} value={roleName} />
					<DetailRow label={t("staff.profile.fields.hireDate")} value={data.hireDate} />
					<DetailRow label={t("staff.profile.fields.assignedRooms")} value={roomNames} />
				</div>
			</div>

			{/* Schedule */}
			<div className="flex flex-col gap-3">
				<SectionHeader
					icon={<SolarCalendarBroken className="size-5 text-foreground" />}
					label={t("staff.profile.sections.schedule")}
				/>
				<DetailRow label={t("staff.profile.fields.workingDays")} value={workingDayNames} />
			</div>

			{/* Medical info */}
			<div className="flex flex-col gap-3">
				<SectionHeader
					icon={<JamMedical className="size-5 text-foreground" />}
					label={t("staff.profile.sections.medicalInfo")}
				/>
				<div className="grid grid-cols-3 gap-x-8 gap-y-3">
					<DetailRow label={t("staff.profile.fields.allergies")} value={data.allergies?.join(", ")} />
					<div className="flex flex-col gap-3">
						<DetailRow label={t("staff.profile.fields.doctor")} value={data.doctorName} />
						<DetailRow label={t("staff.profile.fields.doctorPhone")} value={data.doctorPhone} />
					</div>
					<DetailRow label={t("staff.profile.fields.medications")} value={data.medications} />
				</div>
			</div>

			{/* Emergency contact */}
			<div className="flex flex-col gap-3">
				<SectionHeader
					icon={<StreamlineUltimateEmergencyCall className="size-5 text-foreground" />}
					label={t("staff.profile.sections.emergencyContact")}
				/>
				<div className="grid grid-cols-3 gap-x-8 gap-y-3">
					<DetailRow label={t("staff.profile.fields.name")} value={data.emergencyContactName} />
					<DetailRow label={t("staff.profile.fields.phone")} value={data.emergencyContactPhone} />
					<DetailRow label={t("staff.profile.fields.relationshipToStaff")} value={relationshipName} />
				</div>
			</div>

			{/* Invite switch */}
			<Controller
				control={control}
				name="inviteToKindora"
				render={({ field }) => (
					<div className="flex w-full items-center justify-between">
						<span className="text-default-600 text-sm">{t("staff.addStaff.invitePrompt")}</span>
						<Switch isSelected={field.value} onChange={field.onChange} size="sm">
							<Switch.Content>
								<Switch.Control>
									<Switch.Thumb />
								</Switch.Control>
								{t("staff.addStaff.invite")}
							</Switch.Content>
						</Switch>
					</div>
				)}
			/>
		</div>
	)
}

export default ConfirmStep
