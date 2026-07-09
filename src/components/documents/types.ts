export type DocumentStatus = "active" | "expiring_soon" | "expired" | "uploaded"

export interface DocumentMedia {
	id: string
	path: string
	name?: string
}

export interface DocumentRecord {
	id: number
	media: DocumentMedia
	status: DocumentStatus
	expiryDate: string | null
	type: string
	notes: string | null
	uploadedAt: string
	uploadedBy: { id: string; name: string } | null
}

export interface DocumentTypeOption {
	key: string
	label: string
	labelKey?: string
}

export interface DocumentUploadData {
	type: string
	expiryDate?: string
	notes?: string
}
