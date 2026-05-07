import { z } from "zod"

import { MAX_ROOM_AGE_MONTHS, MIN_ROOM_AGE_MONTHS } from "../constants"

import type { TFunction } from "i18next"

export const createRoomProfileSchema = (t: TFunction) =>
	z
		.object({
			name: z
				.string({ message: t("rooms.validation.roomNameRequired") })
				.trim()
				.min(1, t("rooms.validation.roomNameRequired")),
			capacity: z
				.number({ message: t("rooms.validation.capacityRequired") })
				.int()
				.min(1, t("rooms.validation.capacityMin")),
			ratio: z
				.number({ message: t("rooms.validation.ratioRequired") })
				.int()
				.min(1, t("rooms.validation.ratioMin")),
			minAge: z
				.number({ message: t("rooms.validation.minAgeRequired") })
				.int()
				.min(MIN_ROOM_AGE_MONTHS, t("rooms.validation.minAgeMin", { count: MIN_ROOM_AGE_MONTHS }))
				.max(MAX_ROOM_AGE_MONTHS, t("rooms.validation.minAgeMax", { count: MAX_ROOM_AGE_MONTHS })),
			maxAge: z
				.number({ message: t("rooms.validation.maxAgeRequired") })
				.int()
				.min(MIN_ROOM_AGE_MONTHS, t("rooms.validation.maxAgeMin", { count: MIN_ROOM_AGE_MONTHS }))
				.max(MAX_ROOM_AGE_MONTHS, t("rooms.validation.maxAgeMax", { count: MAX_ROOM_AGE_MONTHS })),
			avatarFile: z.instanceof(File).optional().nullable(),
			avatarPreview: z.string().optional().nullable(),
			staffIds: z.array(z.string()),
		})
		.superRefine((data, context) => {
			if (data.minAge > data.maxAge) {
				context.addIssue({
					code: z.ZodIssueCode.custom,
					message: t("rooms.validation.minAgeGreaterThanMax"),
					path: ["minAge"],
				})
			}
		})

export type RoomProfileFormData = z.infer<ReturnType<typeof createRoomProfileSchema>>
