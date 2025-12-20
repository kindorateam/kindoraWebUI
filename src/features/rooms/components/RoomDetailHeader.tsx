import { Avatar, Tab, Tabs } from "@heroui/react"

import IdentityChip from "@/components/IdentityChip"
import LabeledNumberBadge from "@/components/LabeledNumberBadge"

import { useRoom } from "../hooks/useRooms"
import { formatAgeRange } from "../utils/ageFormat"

type TabType = "students" | "activity" | "profile"

interface RoomDetailHeaderProps {
	roomId: string
	activeTab: TabType
	onTabChange: (tab: TabType) => void
}

const RoomDetailHeader = ({ activeTab, roomId, onTabChange }: RoomDetailHeaderProps) => {
	const { data: room } = useRoom(roomId)

	const signedInCount = room?.signedInStudents.filter((s) => s.checkedIn).length ?? 0

	const stats = [
		{ label: "Capacity", value: room?.capacity ?? 0 },
		{ label: "Students", value: room?.studentsCount ?? 0 },
		{ label: "Sign In", value: signedInCount },
		{ label: "Ratio", value: room?.ratio ?? 0 },
	]

	const staffMembers = room?.signedInStaff ?? []

	return (
		<div>
			<div className="container mx-auto max-w-4xl">
				<div className="mb-13 flex">
					<div className="me-7">
						<Avatar className="size-37.5" name={room?.name ?? "Room"} showFallback />
					</div>
					<div className="w-full">
						<h1 className="mb-2 font-semibold leading-none lg:text-[36px]">{room?.name ?? "Room"}</h1>
						{room?.minAge != null && room?.maxAge != null && (
							<p className="text-default-500 text-sm">Age range: {formatAgeRange(room.minAge, room.maxAge)}</p>
						)}
						<div className="mt-3.5 mb-4 flex items-center">
							<div className="flex flex-wrap gap-4">
								{stats.map((stat) => (
									<LabeledNumberBadge key={stat.label} label={stat.label} value={stat.value} />
								))}
							</div>
						</div>
						<div className="flex gap-3.5">
							{staffMembers.length > 0 ? (
								staffMembers.map((staff) => <IdentityChip fullName={staff.name} key={staff.id} />)
							) : (
								<span className="text-default-400 text-sm">No staff assigned to this room</span>
							)}
						</div>
					</div>
				</div>

				<Tabs
					aria-label="Room details tabs"
					classNames={{ tabList: "shadow-md" }}
					color="primary"
					onSelectionChange={(key) => onTabChange(key as TabType)}
					selectedKey={activeTab}
					radius="sm"
					size="sm"
					variant="solid"
				>
					<Tab key="students" title="Students" />
					<Tab key="activity" title="Activity" />
					<Tab key="profile" title="Profile" />
				</Tabs>
			</div>
		</div>
	)
}

export default RoomDetailHeader
