import { Avatar, Tabs, Tooltip } from "@heroui/react"

import IdentityChip from "@/components/IdentityChip"
import LabeledNumberBadge from "@/components/LabeledNumberBadge"
import { getMediaUrl } from "@/utils/media"
import MaterialSymbolsAddAPhotoRounded from "~icons/material-symbols/add-a-photo-rounded"
import PhSmileyDuotone from "~icons/ph/smiley-duotone"
import PhSmileySadDuotone from "~icons/ph/smiley-sad-duotone"

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
	const studentsCount = room?.studentsCount ?? 0
	const staffCount = room?.staffCount ?? 0
	const ratioValue = room?.ratio ?? 0
	const actualRatio = staffCount > 0 ? studentsCount / staffCount : studentsCount
	const isGoodRatio = actualRatio <= ratioValue

	const stats = [
		{ label: "Capacity", value: room?.capacity ?? 0, badgeVariant: "circle" as const },
		{ label: "Students", value: studentsCount, badgeVariant: "circle" as const },
		{ label: "Sign In", value: signedInCount, badgeVariant: "circle" as const },
		{
			label: "Ratio",
			icon: (
				<Tooltip delay={300}>
					<Tooltip.Trigger className="inline-flex" aria-label={isGoodRatio ? "Ratio is met" : "Ratio is not met"}>
						<span className="inline-flex cursor-default items-center justify-center">
							{isGoodRatio ? (
								<PhSmileyDuotone className="size-5 text-success" />
							) : (
								<PhSmileySadDuotone className="size-5 text-danger" />
							)}
						</span>
					</Tooltip.Trigger>
					<Tooltip.Content>
						{isGoodRatio ? `Ratio is met (1:${ratioValue})` : `Ratio is not met (1:${ratioValue})`}
					</Tooltip.Content>
				</Tooltip>
			),
		},
	]

	const staffMembers = room?.signedInStaff ?? []

	return (
		<div>
			<div className="container mx-auto max-w-4xl">
				<div className="mb-13 flex">
					<div className="me-7">
						<Avatar className="size-37.5 bg-[#1D6FE8] text-white">
							<Avatar.Image
								src={room?.logo ? getMediaUrl(room.logo) : undefined}
								alt={room?.name ?? "Room"}
								className="object-cover"
							/>
							<Avatar.Fallback className="text-white">
								<MaterialSymbolsAddAPhotoRounded className="size-25" />
							</Avatar.Fallback>
						</Avatar>
					</div>
					<div className="w-full">
						<h1 className="mb-2 font-semibold leading-none lg:text-[36px]">{room?.name ?? "Room"}</h1>
						{room?.minAge != null && room?.maxAge != null && (
							<p className="flex items-center gap-2 text-sm">
								<span className="text-default-500">Age range:</span>
								<span className="font-medium text-neutral-800">{formatAgeRange(room.minAge, room.maxAge)}</span>
							</p>
						)}
						<div className="mt-3.5 mb-4 flex items-center">
							<div className="flex flex-wrap gap-4">
								{stats.map((stat) => (
									<LabeledNumberBadge
										badgeVariant={stat.badgeVariant}
										icon={stat.icon}
										key={stat.label}
										label={stat.label}
										value={stat.value}
									/>
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

				<Tabs onSelectionChange={(key) => onTabChange(key as TabType)} selectedKey={activeTab}>
					<Tabs.ListContainer>
						<Tabs.List
							aria-label="Room details tabs"
							className="*:data-[selected=true]:text-accent-foreground w-fit *:h-6 *:w-fit *:px-3 *:text-sm *:font-normal"
						>
							<Tabs.Tab id="students">
								Students
								<Tabs.Indicator className="bg-accent" />
							</Tabs.Tab>
							<Tabs.Tab id="activity">
								Activity
								<Tabs.Indicator className="bg-accent" />
							</Tabs.Tab>
							<Tabs.Tab id="profile">
								Profile
								<Tabs.Indicator className="bg-accent" />
							</Tabs.Tab>
						</Tabs.List>
					</Tabs.ListContainer>
					<Tabs.Panel id="students" className="hidden">
						{null}
					</Tabs.Panel>
					<Tabs.Panel id="activity" className="hidden">
						{null}
					</Tabs.Panel>
					<Tabs.Panel id="profile" className="hidden">
						{null}
					</Tabs.Panel>
				</Tabs>
			</div>
		</div>
	)
}

export default RoomDetailHeader
