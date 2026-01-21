const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL ?? "http://localhost:8000"

/**
 * Constructs a full URL for media files (images, uploads, etc.)
 * @param path - The relative path from the API (e.g., "/uploads/rooms/logo.jpg")
 * @returns The full URL with the media base URL prepended
 */
export const getMediaUrl = (path: string): string => {
	if (!path) return ""
	// If already a full URL, return as-is
	if (path.startsWith("http://") || path.startsWith("https://")) {
		return path
	}
	return `${MEDIA_BASE_URL}${path}`
}
