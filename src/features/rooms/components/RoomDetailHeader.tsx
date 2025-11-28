import { Avatar, Tab, Tabs } from "@heroui/react"

import Button from "@/components/Button"
import IdentityChip from "@/components/IdentityChip"
import SmileEmoji from "@/components/icons/emojies/SmileEmoji"
import StudentIcon from "@/components/icons/StudentIcon"
import LabeledNumberBadge from "@/components/LabeledNumberBadge"

import { useRoom } from "../hooks/useRooms"

type TabType = "students" | "activity" | "profile"

interface RoomDetailHeaderProps {
	roomId: string
	activeTab: TabType
	onTabChange: (tab: TabType) => void
}

const classroomStats = [
	{
		label: "Capacity",
		value: 30,
	},
	{
		label: "Students",
		value: 25,
	},
	{
		label: "Sign In",
		value: 5,
	},
	{
		label: "Ratio",
		icon: <SmileEmoji />,
	},
]
const staffNames = ["Emily Carter", "James Whiteker"]

const RoomDetailHeader = ({ activeTab, roomId, onTabChange }: RoomDetailHeaderProps) => {
	const { data: room } = useRoom(roomId)

	return (
		<div className="border-[#0000000D] border-b">
			<div className="container mx-auto max-w-4xl">
				<div className="mb-13 flex">
					<div className="me-7">
						<Avatar className="size-37.5" showFallback />
					</div>
					<div className="w-full">
						<h1 className="mb-3.5 font-semibold leading-none lg:text-[36px]">{room?.name ?? `Room ${roomId}`}</h1>
						<div className="mb-4 flex items-center">
							<div className="flex flex-wrap gap-4">
								{classroomStats.map((stat) => (
									<LabeledNumberBadge
										key={stat.label}
										label={stat.label}
										{...(stat.icon ? { icon: stat.icon } : { value: stat.value })}
									/>
								))}
							</div>
							<Button className="ms-auto" startContent={<StudentIcon fill="#fff" />}>
								Add student
							</Button>
						</div>
						<div className="flex gap-3.5">
							{staffNames.map((name) => (
								<IdentityChip fullName={name} key={name} />
							))}
						</div>
					</div>
				</div>

				<Tabs
					aria-label="Room details tabs"
					classNames={{
						tabList: "p-0 gap-7",
						cursor: "w-full bg-brand",
						tab: "p-0 pb-5",
						tabContent: "group-data-[selected=true]:text-brand text-neutral-700 font-medium",
					}}
					onSelectionChange={(key) => onTabChange(key as TabType)}
					selectedKey={activeTab}
					variant="underlined"
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
