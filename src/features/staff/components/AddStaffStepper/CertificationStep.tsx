import { Input, Select, SelectItem } from "@heroui/react"
import { Controller, useFormContext } from "react-hook-form"

import TablerCertificate from "~icons/tabler/certificate"

import { DEGREE_OPTIONS } from "../../constants"

import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const CertificationStep = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext<AddStaffFormData>()

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="font-medium text-xl">Add staff</h2>
				<div className="flex items-center gap-2.5 py-1.5">
					<TablerCertificate className="size-4 text-foreground" />
					<span className="font-semibold text-foreground text-sm">Certification</span>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<Controller
					control={control}
					name="degree"
					render={({ field }) => (
						<Select
							errorMessage={errors.degree?.message}
							isInvalid={!!errors.degree}
							label="Degree"
							labelPlacement="inside"
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0]
								if (selected !== undefined) {
									field.onChange(String(selected))
								}
							}}
							radius="md"
							selectedKeys={field.value ? [field.value] : []}
							size="sm"
							variant="flat"
						>
							{DEGREE_OPTIONS.map((degree) => (
								<SelectItem key={degree.key}>{degree.label}</SelectItem>
							))}
						</Select>
					)}
				/>
				<Controller
					control={control}
					name="certification"
					render={({ field }) => (
						<Input
							{...field}
							errorMessage={errors.certification?.message}
							isInvalid={!!errors.certification}
							label="Certification"
							labelPlacement="inside"
							placeholder="Enter certification number"
							radius="md"
							size="sm"
							variant="flat"
						/>
					)}
				/>
			</div>
		</div>
	)
}

export default CertificationStep
