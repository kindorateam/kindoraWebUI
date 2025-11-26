import SubHeader from "@/components/SubHeader"
import AddRoomModal from "@/features/rooms/components/AddRoomModal"
import RoomsTable from "@/features/rooms/components/RoomsTable"

const RoomsPage = () => {
	return (
		<>
			{/* <SubHeader /> */}
			<main className="container mx-auto max-w-4xl px-4">
				<h1 className="mb-8 font-semibold text-4xl">Rooms</h1>
				<RoomsTable />
			</main>
			<AddRoomModal />
		</>
	)
}

export default RoomsPage
