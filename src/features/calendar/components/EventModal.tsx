import { Button, Input, Label, ListBox, Modal, Select, Switch, TextArea, TextField, toast } from "@heroui/react"
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
			toast(isEditMode ? "Event updated" : "Event created", { variant: "success" })
			closeEventModal()
		}

		const onError = (error: Error) => {
			toast(`Failed to ${isEditMode ? "update" : "create"} event`, {
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
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Modal.Container>
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Header>
						<Modal.Heading>{isEditMode ? "Edit Event" : "New Event"}</Modal.Heading>
					</Modal.Header>
					<Modal.Body className="gap-4">
						<TextField isRequired>
							<Label>Title</Label>

							<Input
								placeholder="Event title"
								value={formData.title}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => ((v) => updateField("title", v))(e.target.value)}
								autoFocus
							/>
						</TextField>

						<TextField>
							<Label>Description</Label>
							<TextArea
								placeholder="Optional description"
								value={formData.description}
								onChange={(e) => ((v: string) => updateField("description", v))(e.target.value)}
							/>
						</TextField>

						<Switch
							size="sm"
							isSelected={formData.allDay}
							onChange={(isSelected: boolean) => updateField("allDay", isSelected)}
						>
							<Switch.Control>
								<Switch.Thumb />
							</Switch.Control>
							<Switch.Content>
								<Label>All day</Label>
							</Switch.Content>
						</Switch>

						<div className="grid grid-cols-2 gap-3">
							<TextField isRequired>
								<Label>Start date</Label>

								<Input
									type="date"
									value={formData.startDate}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										((v) => updateField("startDate", v))(e.target.value)
									}
								/>
							</TextField>
							{!formData.allDay && (
								<TextField>
									<Label>Start time</Label>

									<Input
										type="time"
										value={formData.startTime}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											((v) => updateField("startTime", v))(e.target.value)
										}
									/>
								</TextField>
							)}
						</div>

						<div className="grid grid-cols-2 gap-3">
							<TextField isRequired>
								<Label>End date</Label>

								<Input
									type="date"
									value={formData.endDate}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										((v) => updateField("endDate", v))(e.target.value)
									}
								/>
							</TextField>
							{!formData.allDay && (
								<TextField>
									<Label>End time</Label>

									<Input
										type="time"
										value={formData.endTime}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											((v) => updateField("endTime", v))(e.target.value)
										}
									/>
								</TextField>
							)}
						</div>

						<Select
							selectedKey={formData.color}
							onSelectionChange={(key) => {
								if (key !== null) updateField("color", String(key))
							}}
						>
							<Label>Color</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{EVENT_COLOR_OPTIONS.map((opt) => (
										<ListBox.Item id={opt.key} key={opt.key} textValue={opt.label}>
											<div className="size-3 rounded-full" style={{ backgroundColor: opt.key }} />
											{opt.label}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
						</Select>
					</Modal.Body>
					<Modal.Footer>
						{isEditMode && (
							<Button variant="ghost" onPress={handleDelete} isDisabled={isLoading}>
								Delete
							</Button>
						)}
						<div className="flex-1" />
						<Button variant="ghost" onPress={handleClose} isDisabled={isLoading}>
							Cancel
						</Button>
						<Button variant="primary" onPress={handleSubmit} isPending={isLoading} isDisabled={!formData.title.trim()}>
							{isEditMode ? "Save" : "Create"}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default EventModal
