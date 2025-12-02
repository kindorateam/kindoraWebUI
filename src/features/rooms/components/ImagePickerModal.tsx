import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from "@heroui/react"
import { useCallback, useRef, useState } from "react"

import TablerCloudUpload from "~icons/tabler/cloud-upload"

interface ImagePickerModalProps {
	isOpen: boolean
	onClose: () => void
	onSelect: (image: string | File) => void
}

const gradients = [
	"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
	"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
	"linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
	"linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
	"linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
	"linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
	"linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
	"linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
]

const ImagePickerModal = ({ isOpen, onClose, onSelect }: ImagePickerModalProps) => {
	const [selectedTab, setSelectedTab] = useState<string>("gallery")
	const [selectedGradient, setSelectedGradient] = useState<string | null>(null)
	const [uploadedFile, setUploadedFile] = useState<File | null>(null)
	const [uploadPreview, setUploadPreview] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileSelect = useCallback((file: File) => {
		if (file?.type.startsWith("image/")) {
			setUploadedFile(file)
			setUploadPreview(URL.createObjectURL(file))
			setSelectedGradient(null)
		}
	}, [])

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			handleFileSelect(file)
		}
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
		const file = e.dataTransfer.files?.[0]
		if (file) {
			handleFileSelect(file)
		}
	}

	const handleGradientSelect = (gradient: string) => {
		setSelectedGradient(gradient)
		setUploadedFile(null)
		setUploadPreview(null)
	}

	const handleUpload = () => {
		if (selectedTab === "gallery" && selectedGradient) {
			onSelect(selectedGradient)
		} else if (selectedTab === "upload" && uploadedFile) {
			onSelect(uploadedFile)
		}
		handleClose()
	}

	const handleClose = () => {
		setSelectedGradient(null)
		setUploadedFile(null)
		setUploadPreview(null)
		setSelectedTab("gallery")
		onClose()
	}

	const isUploadDisabled =
		(selectedTab === "gallery" && !selectedGradient) || (selectedTab === "upload" && !uploadedFile)

	return (
		<Modal isOpen={isOpen} onClose={handleClose} size="md">
			<ModalContent className="gap-0 p-5">
				<ModalHeader className="mb-5 flex-col items-start gap-1 p-0">
					<h2 className="font-semibold text-lg">Select Image</h2>
				</ModalHeader>
				<ModalBody className="mb-7 gap-4 p-0">
					<Tabs
						aria-label="Image picker tabs"
						classNames={{
							tabList: "w-full",
							tab: "flex-1",
							panel: "p-0",
						}}
						color="primary"
						fullWidth
						onSelectionChange={(key) => setSelectedTab(key as string)}
						selectedKey={selectedTab}
						variant="solid"
					>
						<Tab key="gallery" title="Gallery">
							<div className="grid grid-cols-4 gap-2">
								{gradients.map((gradient) => (
									<button
										className={`aspect-square cursor-pointer rounded-lg shadow-md transition-all hover:scale-105 ${
											selectedGradient === gradient ? "ring-3 ring-primary ring-offset-2" : ""
										}`}
										key={gradient}
										onClick={() => handleGradientSelect(gradient)}
										style={{ background: gradient }}
										type="button"
									/>
								))}
							</div>
						</Tab>
						<Tab key="upload" title="Upload">
							<div>
								<input
									accept="image/*"
									className="hidden"
									onChange={handleFileInputChange}
									ref={fileInputRef}
									type="file"
								/>
								{uploadPreview ? (
									<div className="relative flex flex-col items-center gap-4">
										<div
											className="aspect-square w-32 overflow-hidden rounded-lg bg-center bg-cover shadow-md"
											style={{ backgroundImage: `url(${uploadPreview})` }}
										/>
										<Button
											color="danger"
											onPress={() => {
												setUploadedFile(null)
												setUploadPreview(null)
												if (fileInputRef.current) {
													fileInputRef.current.value = ""
												}
											}}
											size="sm"
											variant="flat"
										>
											Remove
										</Button>
									</div>
								) : (
									<button
										className={`flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors ${
											isDragging ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"
										}`}
										onClick={() => fileInputRef.current?.click()}
										onDragLeave={handleDragLeave}
										onDragOver={handleDragOver}
										onDrop={handleDrop}
										type="button"
									>
										<TablerCloudUpload className="size-12 text-gray-400" />
										<div className="text-center">
											<p className="font-medium text-gray-600">Drag & drop your image here</p>
											<p className="text-gray-400 text-sm">or click to browse</p>
										</div>
									</button>
								)}
							</div>
						</Tab>
					</Tabs>
				</ModalBody>
				<ModalFooter className="p-0">
					<Button color="primary" fullWidth isDisabled={isUploadDisabled} onPress={handleUpload}>
						Upload
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default ImagePickerModal
