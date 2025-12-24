import { Card, CardBody, CardHeader, Chip } from "@heroui/react"

import type { EmployeeFull } from "../../types"

interface StaffProfileTabProps {
	employeeData: EmployeeFull | undefined
}

const formatDate = (dateString: string | null | undefined): string => {
	if (!dateString) return "—"
	try {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		})
	} catch {
		return dateString
	}
}

const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
	<div className="flex flex-col gap-1">
		<span className="text-neutral-500 text-sm">{label}</span>
		<span className="text-neutral-900">{value || "—"}</span>
	</div>
)

const StaffProfileTab = ({ employeeData }: StaffProfileTabProps) => {
	const employee = employeeData?.employee
	const certification = employeeData?.certification
	const medicalInfo = employeeData?.medicalInfo
	const emergencyContacts = employeeData?.emergencyContacts ?? []
	const schedule = employeeData?.schedule

	return (
		<div className="flex flex-col gap-6">
			{/* Personal Information */}
			<Card>
				<CardHeader className="px-6 pt-6 pb-0">
					<h3 className="font-semibold text-lg">Personal Information</h3>
				</CardHeader>
				<CardBody className="gap-4 px-6 py-5">
					<div className="grid grid-cols-2 gap-4">
						<InfoRow label="First Name" value={employee?.firstname} />
						<InfoRow label="Last Name" value={employee?.lastname} />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<InfoRow label="Email" value={employee?.email} />
						<InfoRow label="Phone" value={employee?.phone} />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<InfoRow label="Hire Date" value={formatDate(employee?.hireDate)} />
						<InfoRow label="Account Status" value={employee?.accountStatus} />
					</div>

					<h4 className="mt-4 font-medium text-base">Address</h4>
					<InfoRow label="Street Address" value={employee?.streetAddress} />
					<div className="grid grid-cols-3 gap-4">
						<InfoRow label="City" value={employee?.city} />
						<InfoRow label="State" value={employee?.state} />
						<InfoRow label="ZIP Code" value={employee?.zipCode} />
					</div>
				</CardBody>
			</Card>

			{/* Certification */}
			{certification && (
				<Card>
					<CardHeader className="px-6 pt-6 pb-0">
						<h3 className="font-semibold text-lg">Certification</h3>
					</CardHeader>
					<CardBody className="gap-4 px-6 py-5">
						<div className="grid grid-cols-2 gap-4">
							<InfoRow label="Degree" value={certification.degree} />
							<InfoRow label="Certification" value={certification.certification} />
						</div>
					</CardBody>
				</Card>
			)}

			{/* Medical Information */}
			{medicalInfo && (
				<Card>
					<CardHeader className="px-6 pt-6 pb-0">
						<h3 className="font-semibold text-lg">Medical Information</h3>
					</CardHeader>
					<CardBody className="gap-4 px-6 py-5">
						<div className="flex flex-col gap-1">
							<span className="text-neutral-500 text-sm">Allergies</span>
							<div className="flex flex-wrap gap-2">
								{medicalInfo.allergies.length > 0 ? (
									medicalInfo.allergies.map((allergy) => (
										<Chip key={allergy} size="sm" variant="flat">
											{allergy}
										</Chip>
									))
								) : (
									<span className="text-neutral-900">None</span>
								)}
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<InfoRow label="Medications" value={medicalInfo.medications} />
							<InfoRow label="Doctor Name" value={medicalInfo.doctorName} />
						</div>
						<InfoRow label="Doctor Phone" value={medicalInfo.doctorPhone} />
					</CardBody>
				</Card>
			)}

			{/* Emergency Contacts */}
			{emergencyContacts.length > 0 && (
				<Card>
					<CardHeader className="px-6 pt-6 pb-0">
						<h3 className="font-semibold text-lg">Emergency Contacts</h3>
					</CardHeader>
					<CardBody className="gap-4 px-6 py-5">
						{emergencyContacts.map((contact, index) => (
							<div key={contact.id} className={index > 0 ? "border-t pt-4" : ""}>
								<div className="grid grid-cols-3 gap-4">
									<InfoRow label="Name" value={contact.name} />
									<InfoRow label="Relationship" value={contact.relationshipTo} />
									<InfoRow label="Phone" value={contact.phone} />
								</div>
							</div>
						))}
					</CardBody>
				</Card>
			)}

			{/* Schedule */}
			{schedule && (
				<Card>
					<CardHeader className="px-6 pt-6 pb-0">
						<h3 className="font-semibold text-lg">Weekly Schedule</h3>
					</CardHeader>
					<CardBody className="px-6 py-5">
						<div className="flex gap-2">
							{Object.entries(schedule.week).map(([day, isWorking]) => (
								<Chip
									key={day}
									className={isWorking ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}
									size="sm"
									variant="flat"
								>
									{day.toUpperCase()}
								</Chip>
							))}
						</div>
					</CardBody>
				</Card>
			)}
		</div>
	)
}

export default StaffProfileTab
