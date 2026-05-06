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
		labelKey: "nav.dashboard",
		path: "/dashboard",
		icon: <MaterialSymbolsDashboardOutlineRounded />,
	},
	{
		labelKey: "nav.mySchool",
		path: "#",
		icon: <TablerHome />,
		children: [
			{ labelKey: "nav.insights", path: "/insights" },
			{ labelKey: "nav.students", path: "/students" },
			{ labelKey: "nav.rooms", path: "/rooms" },
			{ labelKey: "nav.staff", path: "/staff" },
			{ labelKey: "nav.calendar", path: "/calendar" },
			{ labelKey: "nav.newsActivity", path: "/news-activity" },
		],
	},
	{
		labelKey: "nav.connections",
		path: "#",
		icon: <TablerMessageCircle />,
		children: [
			{ labelKey: "nav.messages", path: "/messages" },
			{ labelKey: "nav.newsletters", path: "/newsletters" },
		],
	},
	{
		labelKey: "nav.billing",
		path: "/billing",
		icon: <TablerWallet />,
	},
	{
		labelKey: "nav.analytics",
		path: "/analytics",
		icon: <TablerDeviceAnalytics />,
	},
	{
		labelKey: "nav.reports",
		path: "/reports",
		icon: <TablerReportAnalytics />,
	},
	{
		labelKey: "nav.admissions",
		path: "/admissions",
		icon: <TablerReport />,
	},
]

export default navDrawerData
