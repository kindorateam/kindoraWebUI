import { z } from "zod"

import { MAX_ROOM_AGE_MONTHS, MIN_ROOM_AGE_MONTHS } from "../constants"

export const addRoomSchema = z
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
		avatarFile: z.instanceof(File).optional(),
		avatarPreview: z.string().optional(),
		staffIds: z.array(z.string()),
		studentIds: z.array(z.string()),
	})
	.superRefine((data, context) => {
		if (data.minAge > data.maxAge) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Min age cannot be greater than max age",
				path: ["minAge"],
			})
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Max age cannot be less than min age",
				path: ["maxAge"],
			})
		}
		if (data.studentIds.length > data.capacity) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Cannot add more than ${data.capacity} students. Go back to change the room capacity.`,
				path: ["studentIds"],
			})
		}
	})

export type AddRoomFormData = z.infer<typeof addRoomSchema>
