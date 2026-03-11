import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Switch,
	Textarea,
	addToast,
} from "@heroui/react"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"

import { getErrorMessage } from "@/utils/error"

import { DEFAULT_EVENT_COLOR, EVENT_COLOR_OPTIONS } from "../constants"
import { useCreateEvent, useUpdateEvent } from "../hooks/useCalendar"
import { openDeleteEventModal } from "../stores/deleteEventModal.store"
import { closeEventModal, eventModalAtom } from "../stores/eventModal.store"
import { combineDateTime, parseDateTime, toExclusiveEndDate, toInclusiveEndDate } from "../utils/eventDate"

import type { EventFormData } from "../types"

const EventModal = () => {
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
		}

		const onSuccess = () => {
			addToast({
				title: isEditMode ? "Event updated" : "Event created",
				color: "success",
			})
			closeEventModal()
		}

		const onError = (error: Error) => {
			addToast({
				title: `Failed to ${isEditMode ? "update" : "create"} event`,
				description: getErrorMessage(error),
				color: "danger",
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
			openDeleteEventModal(event.id, event.title)
		}
	}

	const isLoading = createMutation.isPending || updateMutation.isPending

	const handleClose = () => {
		if (!isLoading) {
			closeEventModal()
		}
	}

	const updateField = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	return (
		<Modal
			classNames={{ closeButton: "cursor-pointer" }}
			isOpen={isOpen}
			onOpenChange={(open) => !open && handleClose()}
			placement="center"
			size="md"
		>
			<ModalContent>
				<ModalHeader>{isEditMode ? "Edit Event" : "New Event"}</ModalHeader>
				<ModalBody className="gap-4">
					<Input
						label="Title"
						placeholder="Event title"
						value={formData.title}
						onValueChange={(v) => updateField("title", v)}
						isRequired
						autoFocus
					/>

					<Textarea
						label="Description"
						placeholder="Optional description"
						value={formData.description}
						onValueChange={(v) => updateField("description", v)}
						minRows={2}
					/>

					<Switch size="sm" isSelected={formData.allDay} onValueChange={(v) => updateField("allDay", v)}>
						All day
					</Switch>

					<div className="grid grid-cols-2 gap-3">
						<Input
							type="date"
							label="Start date"
							value={formData.startDate}
							onValueChange={(v) => updateField("startDate", v)}
							isRequired
						/>
						{!formData.allDay && (
							<Input
								type="time"
								label="Start time"
								value={formData.startTime}
								onValueChange={(v) => updateField("startTime", v)}
							/>
						)}
					</div>

					<div className="grid grid-cols-2 gap-3">
						<Input
							type="date"
							label="End date"
							value={formData.endDate}
							onValueChange={(v) => updateField("endDate", v)}
							isRequired
						/>
						{!formData.allDay && (
							<Input
								type="time"
								label="End time"
								value={formData.endTime}
								onValueChange={(v) => updateField("endTime", v)}
							/>
						)}
					</div>

					<Select
						label="Color"
						selectedKeys={[formData.color]}
						onSelectionChange={(keys) => {
							const selected = Array.from(keys)[0]
							if (selected) updateField("color", String(selected))
						}}
					>
						{EVENT_COLOR_OPTIONS.map((opt) => (
							<SelectItem
								key={opt.key}
								startContent={<div className="size-3 rounded-full" style={{ backgroundColor: opt.key }} />}
							>
								{opt.label}
							</SelectItem>
						))}
					</Select>
				</ModalBody>
				<ModalFooter>
					{isEditMode && (
						<Button color="danger" variant="light" onPress={handleDelete} isDisabled={isLoading}>
							Delete
						</Button>
					)}
					<div className="flex-1" />
					<Button color="default" variant="flat" onPress={handleClose} isDisabled={isLoading}>
						Cancel
					</Button>
					<Button color="primary" onPress={handleSubmit} isLoading={isLoading} isDisabled={!formData.title.trim()}>
						{isEditMode ? "Save" : "Create"}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default EventModal
