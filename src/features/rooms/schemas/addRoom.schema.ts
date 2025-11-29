import { z } from "zod"

export const addRoomSchema = z.object({
	name: z.string().min(1, "Room name is required"),
	capacity: z.number().int().min(1, "Capacity must be at least 1"),
	ratio: z.number().int().min(1, "Ratio must be at least 1"),
	avatarFile: z.instanceof(File).optional(),
	avatarPreview: z.string().optional(),
	staffIds: z.array(z.string()),
	studentIds: z.array(z.string()),
})

export type AddRoomFormData = z.infer<typeof addRoomSchema>
