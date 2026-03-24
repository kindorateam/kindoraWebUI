import { Input, Label, ListBox, Select } from "@heroui/react"
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
					<TablerCertificate className="size-5 text-foreground" />
					<span className="font-semibold text-foreground text-sm">Certification</span>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<Controller
					control={control}
					name="degree"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.degree}
							onSelectionChange={(key) => {
								if (key !== undefined) {
									field.onChange(String(key))
								}
							}}
							selectedKey={field.value ?? null}
						>
							<Label>Degree</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{DEGREE_OPTIONS.map((degree) => (
										<ListBox.Item id={degree.key} key={degree.key} textValue={degree.label}>
											{degree.label}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
							{errors.degree?.message && (
								<span className="text-danger text-xs">{errors.degree.message}</span>
							)}
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
