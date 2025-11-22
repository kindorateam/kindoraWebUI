import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Pagination,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react"
import { Link } from "@tanstack/react-router"
import { useCallback, useMemo, useState } from "react"

import TableError from "@/components/TableError"

import { useRooms } from "../../hooks/useRooms"
import RoomIcon from "../RoomIcon"
import RoomsEmptyState from "../RoomsEmptyState"

import columns from "./columns"

import type { Room } from "../../types"

const RoomsTable = () => {
	const { data: rooms = [], isLoading, error, refetch } = useRooms()
	const [page, setPage] = useState(1)
	const rowsPerPage = 10

	const pages = Math.ceil(rooms.length / rowsPerPage)

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage
		const end = start + rowsPerPage

		return rooms.slice(start, end)
	}, [page, rooms])

	const renderCell = useCallback((room: Room, columnKey: React.Key) => {
		switch (columnKey) {
			case "room":
				return (
					<Link
						className="flex items-center gap-2 hover:text-primary"
						params={{ roomId: room.id }}
						search={{ tab: "students" }}
						to="/rooms/$roomId"
					>
						<RoomIcon roomType={room.icon} />
						<span className="font-medium text-sm">{room.name}</span>
					</Link>
				)

			case "capacity":
				return <span className="text-gray-600 text-sm">{room.capacity}</span>

			case "students":
				return <span className="text-gray-600 text-sm">{room.studentsCount}</span>

			case "staff":
				return <span className="text-gray-600 text-sm">{room.staffCount}</span>

			case "signInStudents": {
				const { signedInStudents } = room
				const totalStudents = signedInStudents.length

				if (totalStudents === 0) {
					return <span className="text-gray-400 text-sm">No students</span>
				}

				const displayCount = Math.min(2, totalStudents)
				const remainingCount = totalStudents - displayCount

				return (
					<div className="-space-x-2 flex items-center">
						{signedInStudents.slice(0, displayCount).map((student) => (
							<Avatar
								alt={student.name}
								className="h-8 w-8 border-2 border-white"
								key={student.id}
								showFallback
								src={student.avatar}
							/>
						))}
						{remainingCount > 0 && (
							<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200">
								<span className="font-semibold text-gray-700 text-xs">+{remainingCount}</span>
							</div>
						)}
						<span className="ml-3 text-gray-600 text-sm">({totalStudents})</span>
					</div>
				)
			}

			case "signInStaff": {
				const { signedInStaff } = room
				const totalStaff = signedInStaff.length

				if (totalStaff === 0) {
					return <span className="text-gray-400 text-sm">No staff</span>
				}

				const displayCount = Math.min(3, totalStaff)

				return (
					<div className="-space-x-2 flex items-center">
						{signedInStaff.slice(0, displayCount).map((staff) => (
							<Avatar
								alt={staff.name}
								className="h-8 w-8 border-2 border-white"
								key={staff.id}
								showFallback
								src={staff.avatar}
							/>
						))}
					</div>
				)
			}

			case "actions":
				return (
					<Dropdown>
						<DropdownTrigger>
							<button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100" type="button">
								<svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
									<circle cx="8" cy="3" r="1.5" />
									<circle cx="8" cy="8" r="1.5" />
									<circle cx="8" cy="13" r="1.5" />
								</svg>
							</button>
						</DropdownTrigger>
						<DropdownMenu aria-label="Room actions">
							<DropdownItem key="view">View details</DropdownItem>
							<DropdownItem key="edit">Edit room</DropdownItem>
							<DropdownItem key="delete" className="text-danger" color="danger">
								Delete room
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				)

			default:
				return null
		}
	}, [])

	if (isLoading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Spinner size="lg" />
			</div>
		)
	}

	if (error) {
		return <TableError onRetry={refetch} />
	}

	return (
		<Table
			aria-label="Rooms table"
			bottomContent={
				pages > 0 ? (
					<div className="flex w-full justify-center">
						<Pagination
							isCompact
							showControls
							showShadow
							color="primary"
							page={page}
							total={pages}
							onChange={(page) => setPage(page)}
						/>
					</div>
				) : null
			}
		>
			<TableHeader columns={columns}>
				{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
			</TableHeader>
			<TableBody emptyContent={<RoomsEmptyState />} items={items}>
				{(room) => (
					<TableRow key={room.id}>{(columnKey) => <TableCell>{renderCell(room, columnKey)}</TableCell>}</TableRow>
				)}
			</TableBody>
		</Table>
	)
}

export default RoomsTable
