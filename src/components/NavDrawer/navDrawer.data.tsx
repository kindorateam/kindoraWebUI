import AdmissionsIcon from "@/components/icons/AdmissionsIcon"
import AnalyticsIcon from "@/components/icons/AnalyticsIcon"
import BillingIcon from "@/components/icons/BillingIcon"
import DashboardIcon from "@/components/icons/DashboardIcon"
import ReportsIcon from "@/components/icons/ReportsIcon"
import SchoolIcon from "@/components/icons/SchoolIcon"

import MessageIcon from "../icons/MessageIcon"

import type { NavDrawerItem } from "./navDrawer.types"

const navDrawerData: NavDrawerItem[] = [
	{
		label: "Dashboard",
		path: "/dashboard",
		icon: <DashboardIcon />,
	},
	{
		label: "My school",
		path: "#",
		icon: <SchoolIcon />,
		children: [
			{ label: "Insights", path: "/insights" },
			{ label: "Rooms", path: "/rooms" },
			{ label: "Staff", path: "/staff" },
			{ label: "Calendar", path: "/calendar" },
			{ label: "News activity", path: "/news-activity" },
		],
	},
	{
		label: "Connections",
		path: "#",
		icon: <MessageIcon />,
		children: [
			{ label: "Messages", path: "/messages" },
			{ label: "Newsletters", path: "/newsletters" },
		],
	},
	{
		label: "Billing",
		path: "/billing",
		icon: <BillingIcon />,
	},
	{
		label: "Analytics",
		path: "/analytics",
		icon: <AnalyticsIcon />,
	},
	{
		label: "Reports",
		path: "/reports",
		icon: <ReportsIcon />,
	},
	{
		label: "Admissions",
		path: "/admissions",
		icon: <AdmissionsIcon />,
	},
]

export default navDrawerData
