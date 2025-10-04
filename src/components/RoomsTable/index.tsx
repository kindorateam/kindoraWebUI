import { useMemo } from "react"

import createRoomsColumns from "./RoomsTableConfig"

import DataTable from "@/components/DataTable"
import { useRooms } from "@/hooks/useRooms"

const RoomsTable = () => {
	const { data: rooms = [], isLoading } = useRooms()

	const columns = useMemo(() => createRoomsColumns(), [])

	return (
		<DataTable
			columns={columns}
			data={rooms}
			emptyMessage="No rooms found"
			getRowKey={(room) => room.id}
			isLoading={isLoading}
		/>
	)
}

export default RoomsTable
