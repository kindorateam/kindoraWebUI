import { useRef, useState } from "react"

import Text from "@/components/Text"

interface AvatarUploadProps {
	value?: string | File
	onChange: (value: File | null) => void
	error?: string
}

const AvatarUpload = ({ value, onChange, error }: AvatarUploadProps) => {
	const [preview, setPreview] = useState<string | null>(
		typeof value === "string" ? value : value ? URL.createObjectURL(value) : null,
	)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				return
			}

			// Create preview
			const reader = new FileReader()
			reader.onloadend = () => {
				setPreview(reader.result as string)
			}
			reader.readAsDataURL(file)

			onChange(file)
		}
	}

	const handleClick = () => {
		fileInputRef.current?.click()
	}

	const handleRemove = (e: React.MouseEvent) => {
		e.stopPropagation()
		setPreview(null)
		onChange(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ""
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-4">
				{/* Avatar Display */}
				<button
					className={`group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full transition-all ${
						preview ? "bg-neutral-100" : "border-2 border-neutral-300 border-dashed bg-neutral-50 hover:border-brand"
					}`}
					onClick={handleClick}
					type="button"
				>
					{preview ? (
						<>
							<img alt="Room avatar" className="h-full w-full object-cover" src={preview} />
							<div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
								<Text color="neutral-500" size={12} weight="medium">
									Change
								</Text>
							</div>
						</>
					) : (
						<div className="flex flex-col items-center gap-1">
							<svg
								aria-hidden="true"
								className="h-6 w-6 text-neutral-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
							</svg>
							<Text color="neutral-500" size={11}>
								Upload
							</Text>
						</div>
					)}
				</button>

				{/* Info */}
				<div className="flex flex-col gap-1">
					<Text size={14} weight="medium">
						{preview ? "Room Avatar" : "Upload Avatar"}
					</Text>
					<Text color="neutral-600" size={12}>
						{preview ? "Click to change or remove" : "Click to upload an image"}
					</Text>
					{preview && (
						<button
							className="text-left font-medium text-brand text-xs hover:underline"
							onClick={handleRemove}
							type="button"
						>
							Remove avatar
						</button>
					)}
				</div>
			</div>

			{/* Hidden file input */}
			<input accept="image/*" className="hidden" onChange={handleFileSelect} ref={fileInputRef} type="file" />

			{/* Error message */}
			{error && (
				<Text color="neutral-600" size={12}>
					{error}
				</Text>
			)}
		</div>
	)
}

export default AvatarUpload
