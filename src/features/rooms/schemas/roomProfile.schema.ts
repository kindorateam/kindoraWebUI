import { z } from "zod"

import { MAX_ROOM_AGE_MONTHS, MIN_ROOM_AGE_MONTHS } from "../constants"

export const roomProfileSchema = z
	.object({
		name: z.string({ message: "Room name is required" }).trim().min(1, "Room name is required"),
		capacity: z.number({ message: "Capacity is required" }).int().min(1, "Capacity must be at least 1"),
		ratio: z.number({ message: "Ratio is required" }).int().min(1, "Ratio must be at least 1"),
		minAge: z
			.number({ message: "Min age is required" })
			.int()
			.min(MIN_ROOM_AGE_MONTHS, `Min age must be at least ${MIN_ROOM_AGE_MONTHS} month`)
			.max(MAX_ROOM_AGE_MONTHS, `Min age must be at most ${MAX_ROOM_AGE_MONTHS} months`),
		maxAge: z
			.number({ message: "Max age is required" })
			.int()
			.min(MIN_ROOM_AGE_MONTHS, `Max age must be at least ${MIN_ROOM_AGE_MONTHS} month`)
			.max(MAX_ROOM_AGE_MONTHS, `Max age must be at most ${MAX_ROOM_AGE_MONTHS} months`),
		avatarFile: z.instanceof(File).optional().nullable(),
		avatarPreview: z.string().optional().nullable(),
		staffIds: z.array(z.string()),
	})
	.superRefine((data, context) => {
		if (data.minAge > data.maxAge) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Min age cannot be greater than max age",
				path: ["minAge"],
			})
		}
	})

export type RoomProfileFormData = z.infer<typeof roomProfileSchema>
