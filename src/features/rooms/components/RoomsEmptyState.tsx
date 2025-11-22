import { Button, Card, CardBody } from "@heroui/react"
import { Icon } from "@iconify/react"

import { openAddRoomDrawer } from "../stores/addRoomDrawer.store"

const RoomsEmptyState = () => {
	return (
		<Card className="w-full">
			<CardBody className="items-center gap-5 px-7 py-8 text-center">
				<div className="relative h-[89px] w-20 overflow-clip">
					<Icon aria-hidden className="size-full text-primary" icon="twemoji:empty-nest" />
				</div>

				<div className="flex max-w-xl flex-col gap-5">
					<h3 className="font-semibold text-3xl leading-9">No rooms added yet</h3>
					<p className="text-default-700 text-lg leading-7">Please add your first room to get started.</p>
				</div>

				<Button
					className="w-full"
					color="primary"
					endContent={<Icon aria-hidden className="size-5" icon="solar:add-circle-bold" />}
					onPress={openAddRoomDrawer}
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
