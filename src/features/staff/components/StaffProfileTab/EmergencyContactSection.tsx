import { FieldError, Input, Label, TextField } from "@heroui/react"
import { Controller } from "react-hook-form"

import { formatUSPhone } from "@/utils/format"
import StreamlineUltimateEmergencyCall from "~icons/streamline-ultimate/emergency-call"

import SectionHeader from "./SectionHeader"

import type { Control, FieldErrors } from "react-hook-form"
import type { StaffProfileFormData } from "../../schemas/staffProfile.schema"

interface EmergencyContactSectionProps {
	control: Control<StaffProfileFormData>
	errors: FieldErrors<StaffProfileFormData>
	emergencyContacts: StaffProfileFormData["emergencyContacts"]
}

const EmergencyContactSection = ({ control, errors, emergencyContacts }: EmergencyContactSectionProps) => {
	return (
		<section className="flex flex-col gap-6">
			<SectionHeader icon={<StreamlineUltimateEmergencyCall className="size-5" />} title="Emergency contact" />
			<div className="flex flex-col gap-2">
				{emergencyContacts.map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: emergency contacts may not have stable ids
					<div key={index} className="flex items-start gap-2">
						<Controller
							control={control}
							name={`emergencyContacts.${index}.name`}
							render={({ field }) => (
								<TextField className="flex-1" isInvalid={!!errors.emergencyContacts?.[index]?.name} variant="secondary">
									<Label>Name</Label>

									<Input {...field} />

									<FieldError>{errors.emergencyContacts?.[index]?.name?.message}</FieldError>
								</TextField>
							)}
						/>
						<Controller
							control={control}
							name={`emergencyContacts.${index}.phone`}
							render={({ field }) => (
								<TextField
									className="flex-1"
									isInvalid={!!errors.emergencyContacts?.[index]?.phone}
									variant="secondary"
								>
									<Label>Phone</Label>

									<Input
										{...field}
										onChange={(e) => field.onChange(formatUSPhone(e.target.value))}
										placeholder="(555) 123-4567"
										type="tel"
									/>

									<FieldError>{errors.emergencyContacts?.[index]?.phone?.message}</FieldError>
								</TextField>
							)}
						/>
						<Controller
							control={control}
							name={`emergencyContacts.${index}.relationshipTo`}
							render={({ field }) => (
								<TextField className="flex-1" variant="secondary">
									<Label>Relationship to staff</Label>

									<Input {...field} />
								</TextField>
							)}
						/>
					</div>
				))}
			</div>
		</section>
	)
}

export default EmergencyContactSection
