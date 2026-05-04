export type ImageSizeMode = "aspect-ratio" | "height" | "width"

const IMAGE_SIZE_MODES = ["aspect-ratio", "height", "width"] as const

export const getImageSizeMode = (value: unknown): ImageSizeMode =>
	typeof value === "string" && IMAGE_SIZE_MODES.includes(value as ImageSizeMode) ? (value as ImageSizeMode) : "width"
