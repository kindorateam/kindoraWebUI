import { useRef, useState } from "react"

export const useFileDrop = (onFileSelect: (file: File) => void) => {
	const [isDragging, setIsDragging] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) onFileSelect(file)
	}

	const handleDragOver = (event: React.DragEvent) => {
		event.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = (event: React.DragEvent) => {
		event.preventDefault()
		setIsDragging(false)
	}

	const handleDrop = (event: React.DragEvent) => {
		event.preventDefault()
		setIsDragging(false)
		const file = event.dataTransfer.files?.[0]
		if (file) onFileSelect(file)
	}

	const openFilePicker = () => fileInputRef.current?.click()

	const resetFileInput = () => {
		if (fileInputRef.current) fileInputRef.current.value = ""
		setIsDragging(false)
	}

	return {
		fileInputRef,
		handleDragLeave,
		handleDragOver,
		handleDrop,
		handleFileInputChange,
		isDragging,
		openFilePicker,
		resetFileInput,
	}
}
