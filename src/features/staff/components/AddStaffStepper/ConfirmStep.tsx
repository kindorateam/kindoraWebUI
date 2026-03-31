import { Label, Switch } from "@heroui/react"
import { Controller, useFormContext } from "react-hook-form"

import EosIconsRoleBindingOutlined from "~icons/eos-icons/role-binding-outlined"
import JamMedical from "~icons/jam/medical"
import LucideUserRound from "~icons/lucide/user-round"
import SolarCalendarBroken from "~icons/solar/calendar-broken"
import StreamlineUltimateEmergencyCall from "~icons/streamline-ultimate/emergency-call"
import TablerCertificate from "~icons/tabler/certificate"

import { DEGREE_OPTIONS, MOCK_ROOMS, RELATIONSHIP_OPTIONS, STAFF_ROLES, US_STATES, WORKING_DAYS } from "../../constants"

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

const resolveLabel = (key: string | undefined, options: readonly { key: string; label: string }[]): string => {
	if (!key) return "--"
	return options.find((o) => o.key === key)?.label ?? key
}

const ConfirmStep = () => {
	const { watch, control } = useFormContext<AddStaffFormData>()
	const data = watch()

	const roleName = resolveLabel(data.role, STAFF_ROLES)
	const degreeName = resolveLabel(data.degree, DEGREE_OPTIONS)
	const stateName = resolveLabel(data.state, US_STATES)
	const relationshipName = resolveLabel(data.emergencyContactRelationship, RELATIONSHIP_OPTIONS)

	const roomNames = data.assignedRooms?.map((r) => resolveLabel(r, MOCK_ROOMS)).join(", ") || "--"

	const workingDayNames =
		data.workingDays
			?.slice()
			.sort((a, b) => WORKING_DAYS.findIndex((d) => d.key === a) - WORKING_DAYS.findIndex((d) => d.key === b))
			.map((d) => resolveLabel(d, WORKING_DAYS))
			.join(", ") || "--"

	return (
		<div className="flex flex-col gap-6">
			<h2 className="font-medium text-xl">Confirm Staff Details</h2>

			{/* Personal Info */}
			<div className="flex flex-col gap-3">
				<SectionHeader icon={<LucideUserRound className="size-5 text-foreground" />} label="Personal info" />
				<div className="grid grid-cols-3 gap-x-8 gap-y-3">
					<DetailRow label="First Name" value={data.firstName} />
					<DetailRow label="Last Name" value={data.lastName} />
					<DetailRow label="Phone" value={data.phone} />
					<DetailRow label="Email" value={data.email} />
					<DetailRow label="Role" value={roleName} />
					<DetailRow label="Birthday" value={data.birthday} />
					<DetailRow label="Inroll date" value={data.enrollDate} />
					<DetailRow label="State" value={stateName} />
					<DetailRow label="Zip code" value={data.zipCode} />
					<DetailRow label="City" value={data.city} />
					<DetailRow label="Street" value={data.streetAddress} />
					<DetailRow label="Notes" value={data.notes} />
				</div>
			</div>

			{/* Certification */}
			<div className="flex flex-col gap-3">
				<SectionHeader icon={<TablerCertificate className="size-5 text-foreground" />} label="Certification" />
				<div className="grid grid-cols-2 gap-3">
					<DetailRow label="Degree" value={degreeName} />
					<DetailRow label="Certification" value={data.certification} />
				</div>
			</div>

			{/* Kindora role & status */}
			<div className="flex flex-col gap-3">
				<SectionHeader
					icon={<EosIconsRoleBindingOutlined className="size-5 text-foreground" />}
					label="Kindora role & status"
				/>
				<div className="grid grid-cols-3 gap-x-8 gap-y-3">
					<DetailRow label="Role" value={roleName} />
					<DetailRow label="Hire date" value={data.hireDate} />
					<DetailRow label="Assigned rooms" value={roomNames} />
				</div>
			</div>

			{/* Schedule */}
			<div className="flex flex-col gap-3">
				<SectionHeader icon={<SolarCalendarBroken className="size-5 text-foreground" />} label="Schedule" />
				<DetailRow label="Working days" value={workingDayNames} />
			</div>

			{/* Medical info */}
			<div className="flex flex-col gap-3">
				<SectionHeader icon={<JamMedical className="size-5 text-foreground" />} label="Medical info" />
				<div className="grid grid-cols-3 gap-x-8 gap-y-3">
					<DetailRow label="Allergies" value={data.allergies?.join(", ")} />
					<div className="flex flex-col gap-3">
						<DetailRow label="Doctor" value={data.doctorName} />
						<DetailRow label="Doctor phone" value={data.doctorPhone} />
					</div>
					<DetailRow label="Medications" value={data.medications} />
				</div>
			</div>

			{/* Emergency contact */}
			<div className="flex flex-col gap-3">
				<SectionHeader
					icon={<StreamlineUltimateEmergencyCall className="size-5 text-foreground" />}
					label="Emergency contact"
				/>
				<div className="grid grid-cols-3 gap-x-8 gap-y-3">
					<DetailRow label="Name" value={data.emergencyContactName} />
					<DetailRow label="Phone" value={data.emergencyContactPhone} />
					<DetailRow label="Relationship to staff" value={relationshipName} />
				</div>
			</div>

			{/* Invite switch */}
			<Controller
				control={control}
				name="inviteToKindora"
				render={({ field }) => (
					<div className="flex w-full items-center justify-between">
						<span className="text-default-600 text-sm">Invite staff to join Kindora on their devices?</span>
						<Switch isSelected={field.value} onChange={field.onChange} size="sm">
							<Switch.Control>
								<Switch.Thumb />
							</Switch.Control>
							<Switch.Content>
								<Label>Invite</Label>
							</Switch.Content>
						</Switch>
					</div>
				)}
			/>
		</div>
	)
}

export default ConfirmStep
