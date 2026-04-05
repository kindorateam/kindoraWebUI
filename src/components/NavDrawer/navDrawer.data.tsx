import MaterialSymbolsDashboardOutlineRounded from "~icons/material-symbols/dashboard-outline-rounded"
import TablerDeviceAnalytics from "~icons/tabler/device-analytics"
import TablerHome from "~icons/tabler/home"
import TablerMessageCircle from "~icons/tabler/message-circle"
import TablerReport from "~icons/tabler/report"
import TablerReportAnalytics from "~icons/tabler/report-analytics"
import TablerWallet from "~icons/tabler/wallet"

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
		icon: <TablerHome />,
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
		icon: <TablerMessageCircle />,
		children: [
			{ label: "Messages", path: "/messages" },
			{ label: "Newsletters", path: "/newsletters" },
		],
	},
	{
		label: "Billing",
		path: "/billing",
		icon: <TablerWallet />,
	},
	{
		label: "Analytics",
		path: "/analytics",
		icon: <TablerDeviceAnalytics />,
	},
	{
		label: "Reports",
		path: "/reports",
		icon: <TablerReportAnalytics />,
	},
	{
		label: "Admissions",
		path: "/admissions",
		icon: <TablerReport />,
	},
]

export default navDrawerData
