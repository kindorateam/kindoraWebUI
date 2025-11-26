import { Button } from "@heroui/react"
import { Icon } from "@iconify/react"

import SubHeader from "@/components/SubHeader"
import AddRoomModal from "@/features/rooms/components/AddRoomModal"
import RoomsTable from "@/features/rooms/components/RoomsTable"
import { openAddRoomModal } from "@/features/rooms/stores/addRoomModal.store"

const RoomsPage = () => {
	return (
		<>
			<SubHeader
				endSlot={
					<Button
						color="primary"
						endContent={<Icon aria-hidden className="size-5 text-white" icon="tabler:circle-plus-filled" />}
						onPress={openAddRoomModal}
					>
						Add Room
					</Button>
				}
			/>
			<main className="container mx-auto max-w-4xl px-4 pt-10">
				<RoomsTable />
			</main>
			<AddRoomModal />
		</>
	)
}

export default RoomsPage
