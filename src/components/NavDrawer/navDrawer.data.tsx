import MaterialSymbolsDashboardOutlineRounded from "~icons/material-symbols/dashboard-outline-rounded"
import MaterialSymbolsFactCheckOutlineRounded from "~icons/material-symbols/fact-check-outline-rounded"
import MaterialSymbolsReceiptLongOutlineRounded from "~icons/material-symbols/receipt-long-outline-rounded"
import MaterialSymbolsSchoolOutlineRounded from "~icons/material-symbols/school-outline-rounded"
import MdiChartLine from "~icons/mdi/chart-line"
import MdiDomain from "~icons/mdi/domain"
import MdiMessageOutline from "~icons/mdi/message-outline"

import type { NavDrawerItem } from "./navDrawer.types"

const navDrawerData: NavDrawerItem[] = [
	{
		label: "Dashboard",
		path: "/dashboard",
		icon: <MaterialSymbolsDashboardOutlineRounded />,
	},
	{
		label: "My school",
		path: "#",
		icon: <MdiDomain />,
		children: [
			{ label: "Insights", path: "/insights" },
			{ label: "Students", path: "/students" },
			{ label: "Rooms", path: "/rooms" },
			{ label: "Staff", path: "/staff" },
			{ label: "Calendar", path: "/calendar" },
			{ label: "News activity", path: "/news-activity" },
		],
	},
	{
		label: "Connections",
		path: "#",
		icon: <MdiMessageOutline />,
		children: [
			{ label: "Messages", path: "/messages" },
			{ label: "Newsletters", path: "/newsletters" },
		],
	},
	{
		label: "Billing",
		path: "/billing",
		icon: <MaterialSymbolsReceiptLongOutlineRounded />,
	},
	{
		label: "Analytics",
		path: "/analytics",
		icon: <MdiChartLine />,
	},
	{
		label: "Reports",
		path: "/reports",
		icon: <MaterialSymbolsFactCheckOutlineRounded />,
	},
	{
		label: "Admissions",
		path: "/admissions",
		icon: <MaterialSymbolsSchoolOutlineRounded />,
	},
]

export default navDrawerData
