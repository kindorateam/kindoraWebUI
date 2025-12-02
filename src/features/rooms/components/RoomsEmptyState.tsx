import { Button, Card, CardBody } from "@heroui/react"

import SolarAddCircleBold from "~icons/solar/add-circle-bold"
import TwemojiEmptyNest from "~icons/twemoji/empty-nest"

import { openAddRoomModal } from "../stores/addRoomModal.store"

const RoomsEmptyState = () => {
	return (
		<Card className="w-full">
			<CardBody className="items-center gap-5 px-7 py-8 text-center">
				<div className="relative h-[89px] w-20 overflow-clip">
					<TwemojiEmptyNest aria-hidden className="size-full text-primary" />
				</div>

				<div className="flex max-w-xl flex-col gap-5">
					<h3 className="font-semibold text-3xl leading-9">No rooms added yet</h3>
					<p className="text-default-700 text-lg leading-7">Please add your first room to get started.</p>
				</div>

				<Button
					className="w-full"
					color="primary"
					endContent={<SolarAddCircleBold aria-hidden className="size-5" />}
					onPress={openAddRoomModal}
					size="lg"
					variant="solid"
				>
					Add Room
				</Button>
			</CardBody>
		</Card>
	)
}

export default RoomsEmptyState
