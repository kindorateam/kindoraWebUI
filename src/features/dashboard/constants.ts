import MdiAccountTie from "~icons/mdi/account-tie"
import MdiCamera from "~icons/mdi/camera"
import MdiDoorOpen from "~icons/mdi/door-open"
import MdiFoodApple from "~icons/mdi/food-apple"
import MdiSchool from "~icons/mdi/school"
import MdiToilet from "~icons/mdi/toilet"
import MdiVideo from "~icons/mdi/video"

import type {
	ActivityRoom,
	AttentionItem,
	FinanceCard,
	Person,
	RoomStatus,
	SignedInMetric,
	SummaryMetric,
	UpcomingEvent,
} from "./types"

export const heroCardClassName =
	"rounded-[24px] border-0 bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.04),0px_1px_2px_rgba(0,0,0,0.06),0px_0px_1px_rgba(0,0,0,0.06)]"

export const panelCardClassName =
	"rounded-[24px] border-0 bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.04),0px_1px_2px_rgba(0,0,0,0.06),0px_0px_1px_rgba(0,0,0,0.06)]"

export const signedInMetrics: SignedInMetric[] = [
	{ labelKey: "dashboard.common.students", value: 48, total: 74 },
	{ labelKey: "dashboard.common.staff", value: 16, total: 24 },
]

export const absenteeGroups: Array<{ labelKey: string; people: Person[] }> = [
	{
		labelKey: "dashboard.common.students",
		people: [
			{ name: "Emma Stone", seed: "emma-stone" },
			{ name: "Liam Carter", seed: "liam-carter" },
			{ name: "Olivia Reed", seed: "olivia-reed" },
			{ name: "Mason Hart", seed: "mason-hart" },
			{ name: "Ava Brooks", seed: "ava-brooks" },
		],
	},
	{
		labelKey: "dashboard.common.staff",
		people: [
			{ name: "Nora Blake", seed: "nora-blake" },
			{ name: "James Ford", seed: "james-ford" },
			{ name: "Evelyn Woods", seed: "evelyn-woods" },
		],
	},
]

export const summaryMetrics: SummaryMetric[] = [
	{ labelKey: "dashboard.common.students", value: 74, icon: MdiSchool },
	{ labelKey: "dashboard.common.rooms", value: 5, icon: MdiDoorOpen },
	{ labelKey: "dashboard.common.staff", value: 24, icon: MdiAccountTie },
]

export const roomsStatus: RoomStatus[] = [
	{
		id: "baby-turtles",
		room: "Baby turtles",
		studentsSignedIn: "5/10",
		students: [
			{ name: "Ella Ross", seed: "ella-ross" },
			{ name: "Noah Bell", seed: "noah-bell" },
			{ name: "Luca Day", seed: "luca-day" },
			{ name: "Ava Price", seed: "ava-price" },
			{ name: "Owen Moss", seed: "owen-moss" },
		],
		staffSignedIn: "2/2",
		staff: [
			{ name: "Mila Woods", seed: "mila-woods" },
			{ name: "Jude Hall", seed: "jude-hall" },
		],
		ratio: "58%",
		ratioTone: "warning",
	},
	{
		id: "elephants",
		room: "Elephants",
		studentsSignedIn: "10/10",
		students: [
			{ name: "Leo Park", seed: "leo-park" },
			{ name: "Chloe Fox", seed: "chloe-fox" },
			{ name: "Eli Snow", seed: "eli-snow" },
			{ name: "Sage Dunn", seed: "sage-dunn" },
			{ name: "Mia Lane", seed: "mia-lane" },
		],
		staffSignedIn: "1/3",
		staff: [
			{ name: "Aria White", seed: "aria-white" },
			{ name: "Theo Stone", seed: "theo-stone" },
			{ name: "Ruby Clark", seed: "ruby-clark" },
		],
		ratio: "85%",
		ratioTone: "success",
	},
	{
		id: "little-zebras",
		room: "Little zebras",
		studentsSignedIn: "8/10",
		students: [
			{ name: "Nina Hart", seed: "nina-hart" },
			{ name: "Kai Ford", seed: "kai-ford" },
			{ name: "Ivy King", seed: "ivy-king" },
			{ name: "Zoe Shaw", seed: "zoe-shaw" },
			{ name: "Milo Reed", seed: "milo-reed" },
		],
		staffSignedIn: "2/3",
		staff: [
			{ name: "Mona Hill", seed: "mona-hill" },
			{ name: "Finn Gray", seed: "finn-gray" },
			{ name: "Nate West", seed: "nate-west" },
		],
		ratio: "77%",
		ratioTone: "success",
	},
	{
		id: "baby-giraffe",
		room: "Baby giraffe",
		studentsSignedIn: "9/12",
		students: [
			{ name: "Lucy May", seed: "lucy-may" },
			{ name: "Ezra Knox", seed: "ezra-knox" },
			{ name: "Lila Dean", seed: "lila-dean" },
			{ name: "Jack Moon", seed: "jack-moon" },
			{ name: "Nora King", seed: "nora-king" },
		],
		staffSignedIn: "2/2",
		staff: [
			{ name: "Ari Cole", seed: "ari-cole" },
			{ name: "Pia Reed", seed: "pia-reed" },
		],
		ratio: "70%",
		ratioTone: "warning",
	},
	{
		id: "big-mammoth",
		room: "Big mammoth",
		studentsSignedIn: "5/16",
		students: [
			{ name: "Mara Cross", seed: "mara-cross" },
			{ name: "Dean Frost", seed: "dean-frost" },
			{ name: "June Vale", seed: "june-vale" },
			{ name: "Alec Ray", seed: "alec-ray" },
			{ name: "Tess Stone", seed: "tess-stone" },
		],
		staffSignedIn: "3/3",
		staff: [
			{ name: "Liam Hart", seed: "liam-hart" },
			{ name: "Emma Cole", seed: "emma-cole" },
			{ name: "Ava West", seed: "ava-west" },
		],
		ratio: "42%",
		ratioTone: "danger",
	},
]

export const upcomingEvents: UpcomingEvent[] = [
	{
		day: "FRI",
		date: "24",
		label: "Artist visitor",
		time: "10am - 12pm",
	},
	{
		day: "MON",
		date: "27",
		label: "Sophie birthday",
		time: "All day",
	},
	{
		day: "TUE",
		date: "28",
		label: "Petting zoo visit",
		time: "9am - 1pm",
	},
]

export const attentionItems: AttentionItem[] = [
	{ name: "James Whitaker", description: "Unexplained absence", seed: "james-whitaker" },
	{ name: "Emily Carter", description: "Profile incomplete", seed: "emily-carter" },
	{ name: "Mia Caldwell", description: "Incident", seed: "mia-caldwell" },
]

export const financeCards: FinanceCard[] = [
	{
		labelKey: "dashboard.finance.payments",
		value: "$11,740.00",
		accentClassName: "text-[#17c964]",
		actionLabelKey: "dashboard.finance.seePayments",
		supportingTextKey: "dashboard.finance.received",
	},
	{
		labelKey: "dashboard.finance.totalOutstandingDebt",
		value: "-$7,740.00",
		accentClassName: "text-[#ff383c]",
		actionLabelKey: "dashboard.finance.seeDebtCollection",
		supportingTextKey: "dashboard.finance.totalOutstanding",
	},
]

export const activityRooms: ActivityRoom[] = [
	{
		id: "baby-turtles",
		name: "Baby turtles",
		count: 4,
		entries: [
			{ label: "Photo", count: 4, progress: 35, icon: MdiCamera },
			{ label: "Video", count: 7, progress: 35, icon: MdiVideo },
			{ label: "Food", count: 12, progress: 60, icon: MdiFoodApple },
			{ label: "Bathroom", count: 5, progress: 35, icon: MdiToilet },
		],
	},
	{ id: "elephants", name: "Elephants", count: 4 },
	{ id: "little-zebras", name: "Little zebras", count: 5 },
	{ id: "baby-giraffe", name: "Baby giraffe", count: 16 },
	{ id: "big-mammoth", name: "Big mammoth", count: 8 },
]
