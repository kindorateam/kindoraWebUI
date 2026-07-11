import { Button, Input, Label, Modal, Switch, TextArea, TextField, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"
import TablerTrash from "~icons/tabler/trash"

import { DEFAULT_EVENT_COLOR } from "../constants"
import { useCreateEvent, useUpdateEvent } from "../hooks/useCalendar"
import { openDeleteEventModal } from "../stores/deleteEventModal.store"
import { closeEventModal, eventModalAtom } from "../stores/eventModal.store"
import { combineDateTime, parseDateTime, toExclusiveEndDate, toInclusiveEndDate } from "../utils/eventDate"

import EventColorSelect from "./EventColorSelect"
import EventDateTimeFields from "./EventDateTimeFields"
import EventRepeatFields from "./EventRepeatFields"

import type { EventFormData } from "../types"

const EventModal = () => {
	const { t } = useTranslation()
	const modalState = useAtomValue(eventModalAtom)
	const { isOpen, event, defaultStart, defaultEnd, defaultAllDay } = modalState

	const isEditMode = !!event
	const createMutation = useCreateEvent()
	const updateMutation = useUpdateEvent()

	const [formData, setFormData] = useState<EventFormData>({
		title: "",
		description: "",
		startDate: "",
		startTime: "09:00",
		endDate: "",
		endTime: "10:00",
		allDay: false,
		endsSameDay: true,
		repeatFrequency: "none",
		color: DEFAULT_EVENT_COLOR,
	})

	useEffect(() => {
		if (!isOpen) return

		if (event) {
			const start = parseDateTime(event.start)
			const end = parseDateTime(event.allDay ? toInclusiveEndDate(event.end) : event.end)
			setFormData({
				title: event.title,
				description: event.description ?? "",
				startDate: start.date,
				startTime: start.time,
				endDate: end.date,
				endTime: end.time,
				allDay: event.allDay,
				endsSameDay: start.date === end.date,
				repeatFrequency: event.repeatFrequency ?? "none",
				color: event.color ?? DEFAULT_EVENT_COLOR,
			})
		} else {
			const start = parseDateTime(defaultStart)
			const end = parseDateTime(defaultAllDay && defaultEnd ? toInclusiveEndDate(defaultEnd) : defaultEnd)
			setFormData({
				title: "",
				description: "",
				startDate: start.date,
				startTime: start.time,
				endDate: end.date,
				endTime: end.time,
				allDay: defaultAllDay,
				endsSameDay: start.date === end.date,
				repeatFrequency: "none",
				color: DEFAULT_EVENT_COLOR,
			})
		}
	}, [isOpen, event, defaultStart, defaultEnd, defaultAllDay])

	const handleSubmit = () => {
		if (!formData.title.trim()) return

		const startDate = formData.allDay ? formData.startDate : combineDateTime(formData.startDate, formData.startTime)
		const endDate = formData.allDay
			? toExclusiveEndDate(formData.endDate)
			: combineDateTime(formData.endDate, formData.endTime)

		const payload = {
			title: formData.title.trim(),
			description: formData.description.trim() || undefined,
			startDate,
			endDate,
			allDay: formData.allDay,
			color: formData.color,
			...(!isEditMode
				? {
						repeatFrequency: formData.repeatFrequency,
					}
				: {}),
		}

		const onSuccess = () => {
			toast(isEditMode ? t("calendar.toast.updated") : t("calendar.toast.created"), { variant: "success" })
			closeEventModal()
		}

		const onError = (error: Error) => {
			toast(isEditMode ? t("calendar.toast.updateFailed") : t("calendar.toast.createFailed"), {
				description: getErrorMessage(error),
				variant: "danger",
			})
		}

		if (isEditMode) {
			updateMutation.mutate({ eventId: event.id, payload }, { onSuccess, onError })
		} else {
			createMutation.mutate(payload, { onSuccess, onError })
		}
	}

	const handleDelete = () => {
		if (event) {
			openDeleteEventModal(
				event.id,
				event.title,
				event.start,
				!!event.repeatFrequency && event.repeatFrequency !== "none",
			)
		}
	}

	const isLoading = createMutation.isPending || updateMutation.isPending

	const handleClose = () => {
		if (!isLoading) {
			closeEventModal()
		}
	}

	const updateField = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
		setFormData((prev) => {
			if (field === "startDate" && prev.endsSameDay && typeof value === "string") {
				return { ...prev, startDate: value, endDate: value }
			}

			if (field === "endsSameDay" && value === true) {
				return { ...prev, endsSameDay: true, endDate: prev.startDate }
			}

			if (field === "repeatFrequency") {
				return { ...prev, repeatFrequency: value as EventFormData["repeatFrequency"] }
			}

			return { ...prev, [field]: value }
		})
	}

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Modal.Container>
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Header>
						<Modal.Heading>
							{isEditMode ? t("calendar.modal.editTitle") : t("calendar.modal.createTitle")}
						</Modal.Heading>
					</Modal.Header>
					<Modal.Body className="flex flex-col gap-4">
						<TextField isRequired variant="secondary">
							<Label>{t("calendar.fields.title")}</Label>

							<Input
								placeholder={t("calendar.placeholders.title")}
								value={formData.title}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => ((v) => updateField("title", v))(e.target.value)}
								autoFocus
							/>
						</TextField>

						<TextField variant="secondary">
							<Label>{t("calendar.fields.description")}</Label>
							<TextArea
								placeholder={t("calendar.placeholders.description")}
								value={formData.description}
								onChange={(e) => ((v: string) => updateField("description", v))(e.target.value)}
							/>
						</TextField>

						<Switch
							size="sm"
							isSelected={formData.allDay}
							onChange={(isSelected: boolean) => updateField("allDay", isSelected)}
						>
							<Switch.Content>
								<Switch.Control>
									<Switch.Thumb />
								</Switch.Control>
								{t("calendar.fields.allDay")}
							</Switch.Content>
						</Switch>

						<Switch
							size="sm"
							isSelected={formData.endsSameDay}
							onChange={(isSelected: boolean) => updateField("endsSameDay", isSelected)}
						>
							<Switch.Content>
								<Switch.Control>
									<Switch.Thumb />
								</Switch.Control>
								{t("calendar.fields.endsSameDay")}
							</Switch.Content>
						</Switch>

						<EventDateTimeFields
							startDate={formData.startDate}
							startTime={formData.startTime}
							endDate={formData.endDate}
							endTime={formData.endTime}
							allDay={formData.allDay}
							endsSameDay={formData.endsSameDay}
							onFieldChange={(field, value) => updateField(field, value)}
						/>

						{!isEditMode && (
							<EventRepeatFields
								frequency={formData.repeatFrequency}
								onFrequencyChange={(value) => updateField("repeatFrequency", value)}
							/>
						)}

						<EventColorSelect value={formData.color} onChange={(v) => updateField("color", v)} />
					</Modal.Body>
					<Modal.Footer>
						{isEditMode && (
							<Button variant="danger" onPress={handleDelete} isDisabled={isLoading}>
								<TablerTrash />
								{t("common.delete")}
							</Button>
						)}
						<Button variant="secondary" onPress={handleClose} isDisabled={isLoading}>
							{t("common.cancel")}
						</Button>
						<Button variant="primary" onPress={handleSubmit} isPending={isLoading} isDisabled={!formData.title.trim()}>
							{isEditMode ? t("common.save") : t("common.create")}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default EventModal
