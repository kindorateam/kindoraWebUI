import { Avatar } from "@heroui/react"
import { useFormContext } from "react-hook-form"

import { formatAgeLabel } from "../../constants"

import type { AddRoomFormData } from "../../types"

const ConfirmRoomStep = () => {
	const { watch } = useFormContext<AddRoomFormData>()
	const formData = watch()

	const isGradient = formData.avatarPreview?.startsWith("linear-gradient")

	return (
		<div className="flex flex-col gap-6">
			<h2 className="font-medium text-xl">Confirm Room Details</h2>
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
			<div className="flex justify-between">
				<div className="flex flex-col gap-3">
					<p className="text-base">
						<span className="font-medium">Name:</span> <span className="text-neutral-700">{formData.name}</span>
					</p>
					<p className="text-base">
						<span className="font-medium">Capacity:</span> <span className="text-neutral-700">{formData.capacity}</span>
					</p>
					<p className="text-base">
						<span className="font-medium">Ratio:</span> <span className="text-neutral-700">{formData.ratio}:1</span>
					</p>
					<p className="text-base">
						<span className="font-medium">Age Range:</span>{" "}
						<span className="text-neutral-700">
							{formatAgeLabel(formData.minAge)} - {formatAgeLabel(formData.maxAge)}
						</span>
					</p>
				</div>
				<div className="flex flex-col gap-3">
					<p className="text-base">
						<span className="font-medium">Staff:</span>{" "}
						<span className="text-neutral-700">{formData.staffIds?.length || 0} selected</span>
					</p>
					<p className="text-base">
						<span className="font-medium">Students:</span>{" "}
						<span className="text-neutral-700">{formData.studentIds?.length || 0} selected</span>
					</p>
				</div>
			</div>
		</div>
	)
}

export default ConfirmRoomStep
