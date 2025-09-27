import { Progress } from "@heroui/progress"

import AbsentIcon from "@/components/icons/AbsentIcon"
import RoomIcon from "@/components/icons/RoomIcon"
import SignInIcon from "@/components/icons/SignInIcon"
import StaffIcon from "@/components/icons/StaffIcon"
import StudentIcon from "@/components/icons/StudentIcon"

export const signInCardData = {
	headerData: (
		<div className="flex items-center">
			<div className="bg-brand me-3 flex h-8.5 w-8.5 items-center justify-center rounded-full">
				<SignInIcon fill="#fff" />
			</div>

			<span className="font-semibold">Signed In</span>
		</div>
	),
	bodyData: (
		<div className="flex justify-between">
			<div>
				<p className="mb-3">Students</p>
				<div className="mb-1 flex justify-between">
					<span className="text-4xl">48</span>
					<span className="self-end text-xl">74</span>
				</div>
				<Progress className="ba h-1.5 w-[120px]" value={70} />
			</div>
			<div>
				<p className="mb-3">Staff</p>
				<div className="mb-1 flex justify-between">
					<span className="text-4xl">48</span>
					<span className="self-end text-xl">74</span>
				</div>
				<Progress className="ba h-1.5 w-[120px]" value={70} />
			</div>
		</div>
	),
}

export const absentCardData = {
	headerData: (
		<div className="flex items-center">
			<div className="bg-brand me-3 flex h-8.5 w-8.5 items-center justify-center rounded-full">
				<AbsentIcon fill="#fff" />
			</div>

			<span className="font-semibold">Absentees</span>
		</div>
	),
	bodyData: <div></div>,
}

const _roomCardData = {
	headerData: <RoomIcon />,
	bodyData: {
		title: "Room Occupancy",
		value: 80,
	},
}

const _staffCardData = {
	headerData: <StaffIcon />,
	bodyData: {
		title: "Staff Online",
		value: 10,
	},
}

const _studentCardData = {
	headerData: <StudentIcon />,
	bodyData: {
		title: "Total Students",
		value: 200,
	},
}
