import { Avatar, Button, Card, CardBody, Chip } from "@heroui/react"
import { useState } from "react"

import TablerCalendar from "~icons/tabler/calendar"
import TablerCertificate from "~icons/tabler/certificate"
import TablerChevronDown from "~icons/tabler/chevron-down"
import TablerCloudUpload from "~icons/tabler/cloud-upload"
import TablerPhone from "~icons/tabler/phone"
import TablerStethoscope from "~icons/tabler/stethoscope"
import TablerTrash from "~icons/tabler/trash"
import TablerUser from "~icons/tabler/user"
import TablerUserCog from "~icons/tabler/user-cog"

import { getEmployeeAvatarUrl, getEmployeeFullName } from "../../types"

import ProfileField from "./ProfileField"
import SectionHeader from "./SectionHeader"

import type { EmployeeFull } from "../../types"

interface StaffProfileTabProps {
	employeeData: EmployeeFull | undefined
}

const formatDate = (dateString: string | null | undefined): string => {
	if (!dateString) return "—"
	try {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		})
	} catch {
		return dateString
	}
}

const DAYS_OF_WEEK = [
	{ key: "mon", label: "Mon" },
	{ key: "tue", label: "Tue" },
	{ key: "wed", label: "Wed" },
	{ key: "thu", label: "Thu" },
	{ key: "fri", label: "Fri" },
	{ key: "sat", label: "Sat" },
	{ key: "sun", label: "Sun" },
] as const

const StaffProfileTab = ({ employeeData }: StaffProfileTabProps) => {
	const [isEditing, setIsEditing] = useState(false)

	const employee = employeeData?.employee
	const certification = employeeData?.certification
	const medicalInfo = employeeData?.medicalInfo
	const emergencyContacts = employeeData?.emergencyContacts ?? []
	const schedule = employeeData?.schedule

	const allergies = medicalInfo?.allergies ?? []
	const allergySummary = allergies[0]
	const assignedRooms = employee?.roomId ? [employee.roomId] : []
	const permissions: string[] = []
	const workingDays = schedule ? DAYS_OF_WEEK.filter(({ key }) => schedule.week[key as keyof typeof schedule.week]) : []

	const fullName = employee ? getEmployeeFullName(employee) : "—"
	const avatarUrl = employee ? getEmployeeAvatarUrl(employee) : undefined
	const workingDaysValue = workingDays[0]?.label
	const signUpStatus = employee?.accountStatus ?? employee?.status
	const roomsSummary =
		assignedRooms.length > 0 ? `${assignedRooms.length} ${assignedRooms.length === 1 ? "room" : "rooms"}` : undefined
	const permissionsSummary =
		permissions.length > 0 ? `${permissions.length} ${permissions.length === 1 ? "item" : "items"}` : undefined

	const dropdownIcon = <TablerChevronDown className="size-4 text-default-500" />
	const calendarIcon = <TablerCalendar className="size-4 text-default-500" />
	const chipClassNames = {
		base: "h-8 bg-primary-50 px-3",
		content: "text-sm",
	}

	return (
		<Card className="p-5" radius="md">
			<CardBody className="flex flex-col gap-6 p-0">
				{/* Personal Info */}
				<section className="flex flex-col gap-6">
					<SectionHeader
						icon={<TablerUser className="size-4" />}
						title="Personal info"
						onEdit={() => setIsEditing(!isEditing)}
					/>
					<div className="flex flex-col gap-2">
						<div className="flex gap-2">
							<ProfileField label="Name" value={fullName} isEditing={isEditing} />
							<ProfileField label="Email" value={employee?.email} isEditing={isEditing} />
							<ProfileField label="Phone" value={employee?.phone} isEditing={isEditing} />
						</div>
						<div className="flex gap-2">
							<ProfileField label="Birthday" value={undefined} isEditing={isEditing} />
							<ProfileField label="Gender" value={undefined} isEditing={isEditing} />
							<ProfileField label="Notes" value={undefined} isEditing={isEditing} />
						</div>
						<div className="flex gap-2">
							<ProfileField label="Inroll date" value={undefined} isEditing={isEditing} />
							<ProfileField label="Street address" value={employee?.streetAddress} isEditing={isEditing} />
							<ProfileField endContent={dropdownIcon} label="City" value={employee?.city} isEditing={isEditing} />
						</div>
						<div className="flex gap-2">
							<ProfileField endContent={dropdownIcon} label="State" value={employee?.state} isEditing={isEditing} />
							<ProfileField label="ZIP code" value={employee?.zipCode} isEditing={isEditing} />
						</div>
					</div>
				</section>

				{/* Certification */}
				<section className="flex flex-col gap-6">
					<SectionHeader icon={<TablerCertificate className="size-4" />} title="Certification" />
					<div className="flex flex-col gap-2">
						<div className="flex gap-2">
							<ProfileField
								endContent={dropdownIcon}
								label="Degree"
								value={certification?.degree}
								isEditing={isEditing}
							/>
							<ProfileField label="Certification" value={certification?.certification} isEditing={isEditing} />
						</div>
					</div>
				</section>

				{/* Kindora Role & Status */}
				<section className="flex flex-col gap-6">
					<SectionHeader icon={<TablerUserCog className="size-4" />} title="Kindora role & status" />
					<div className="flex flex-col gap-2">
						<div className="flex gap-2">
							<ProfileField
								endContent={dropdownIcon}
								label="Sign up status"
								value={signUpStatus}
								isEditing={isEditing}
							/>
							<ProfileField endContent={dropdownIcon} label="Role" value={employee?.role} isEditing={isEditing} />
						</div>
						<div className="flex gap-2">
							<ProfileField
								endContent={calendarIcon}
								label="Hire date"
								value={formatDate(employee?.hireDate)}
								isEditing={isEditing}
							/>
							<ProfileField label="Pin" value={employee?.pinCode} isEditing={isEditing} />
						</div>
						<div className="flex gap-2">
							<div className="flex flex-1 flex-col gap-2">
								<ProfileField
									endContent={dropdownIcon}
									label="Assigned rooms"
									value={roomsSummary}
									isEditing={isEditing}
								/>
								<div className="flex flex-wrap gap-2">
									{assignedRooms.length > 0 ? (
										assignedRooms.map((room) => (
											<Chip classNames={chipClassNames} key={room} onClose={() => {}} size="sm" variant="flat">
												{room}
											</Chip>
										))
									) : (
										<span className="text-default-500 text-sm">—</span>
									)}
								</div>
							</div>
							<div className="flex flex-1 flex-col gap-2">
								<ProfileField
									endContent={dropdownIcon}
									label="Permissions"
									value={permissionsSummary}
									isEditing={isEditing}
								/>
								<div className="flex flex-wrap gap-2">
									{permissions.length > 0 ? (
										permissions.map((permission) => (
											<Chip classNames={chipClassNames} key={permission} onClose={() => {}} size="sm" variant="flat">
												{permission}
											</Chip>
										))
									) : (
										<span className="text-default-500 text-sm">—</span>
									)}
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Scheduled Absence / Schedule */}
				<section className="flex flex-col gap-6">
					<SectionHeader icon={<TablerCalendar className="size-4" />} title="Scheduled absence" />
					<div className="flex flex-col gap-2">
						<div className="flex gap-2">
							<div className="flex flex-1 flex-col gap-2">
								<ProfileField
									endContent={dropdownIcon}
									label="Schedule working days"
									value={workingDaysValue}
									isEditing={isEditing}
								/>
								<div className="flex flex-wrap gap-2">
									{DAYS_OF_WEEK.map(({ key, label }) => {
										const isWorking = schedule?.week[key as keyof typeof schedule.week] ?? false
										return (
											<Chip
												classNames={{
													...chipClassNames,
													base: `${chipClassNames.base}${isWorking ? "" : " opacity-30"}`,
												}}
												key={key}
												size="sm"
												variant="flat"
											>
												{label}
											</Chip>
										)
									})}
								</div>
							</div>
							<div className="flex flex-1 flex-col gap-2">
								<ProfileField endContent={calendarIcon} label="Absence date" value={undefined} isEditing={isEditing} />
								<ProfileField endContent={dropdownIcon} label="Reason" value={undefined} isEditing={isEditing} />
							</div>
						</div>
					</div>
				</section>

				{/* Medical Info */}
				<section className="flex flex-col gap-6">
					<SectionHeader icon={<TablerStethoscope className="size-4" />} title="Medical info" />
					<div className="flex flex-col gap-2">
						<div className="flex gap-2">
							<div className="flex flex-1 flex-col gap-2">
								<ProfileField label="Allergies" value={allergySummary} isEditing={isEditing} />
								<div className="flex flex-wrap gap-2">
									{allergies.length > 0 ? (
										allergies.map((allergy) => (
											<Chip classNames={chipClassNames} key={allergy} onClose={() => {}} size="sm" variant="flat">
												{allergy}
											</Chip>
										))
									) : (
										<span className="text-default-500 text-sm">—</span>
									)}
								</div>
							</div>
							<ProfileField label="Medications" value={medicalInfo?.medications} isEditing={isEditing} />
						</div>
						<div className="flex gap-2">
							<ProfileField label="Doctor" value={medicalInfo?.doctorName} isEditing={isEditing} />
							<ProfileField label="Doctor Phone" value={medicalInfo?.doctorPhone} isEditing={isEditing} />
						</div>
					</div>
				</section>

				{/* Emergency Contacts */}
				<section className="flex flex-col gap-6">
					<SectionHeader icon={<TablerPhone className="size-4" />} title="Emergency contact" />
					<div className="flex flex-col gap-2">
						{emergencyContacts.length > 0 ? (
							emergencyContacts.map((contact) => (
								<div key={contact.id} className="flex gap-2">
									<ProfileField label="Name" value={contact.name} isEditing={isEditing} />
									<ProfileField label="Phone" value={contact.phone} isEditing={isEditing} />
									<ProfileField label="Relationship to staff" value={contact.relationshipTo} isEditing={isEditing} />
								</div>
							))
						) : (
							<div className="flex gap-2">
								<ProfileField label="Name" value={undefined} isEditing={isEditing} />
								<ProfileField label="Phone" value={undefined} isEditing={isEditing} />
								<ProfileField label="Relationship to staff" value={undefined} isEditing={isEditing} />
							</div>
						)}
					</div>
				</section>

				{/* Profile Picture */}
				<section className="flex flex-col gap-6">
					<SectionHeader icon={<TablerUser className="size-4" />} title="Profile picture" />
					<div className="flex items-center gap-3">
						<Avatar className="size-20 border-4 border-white shadow-md" showFallback src={avatarUrl} />
						<div className="flex gap-5">
							<Button color="primary" endContent={<TablerCloudUpload className="size-5" />} radius="md" size="sm">
								Upload Picture
							</Button>
							<Button
								className="shadow-sm"
								color="danger"
								endContent={<TablerTrash className="size-5" />}
								radius="md"
								size="sm"
								variant="bordered"
							>
								Delete Picture
							</Button>
						</div>
					</div>
				</section>
			</CardBody>
		</Card>
	)
}

export default StaffProfileTab
