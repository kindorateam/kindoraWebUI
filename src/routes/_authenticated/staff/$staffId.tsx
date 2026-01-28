import { Spinner, Tab, Tabs } from "@heroui/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { RouteErrorBoundary } from "@/components/error"
import StaffDetailHeader from "@/features/staff/components/StaffDetailHeader"
import StaffProfileTab from "@/features/staff/components/StaffProfileTab"
import { useEmployee } from "@/features/staff/hooks/useStaff"
import { getEmployeeById } from "@/features/staff/services/staff.service"
import { getEmployeeFullName } from "@/features/staff/types"
import { useTabNavigation } from "@/hooks/useTabNavigation"
import { queryClient } from "@/services/queryClient"

type TabType = "profile" | "documents"

interface StaffDetailSearch {
	tab: TabType
}

export const Route = createFileRoute("/_authenticated/staff/$staffId")({
	component: StaffDetailLayout,
	parseParams: (params) => ({
		staffId: params.staffId,
	}),
	validateSearch: (search: Record<string, unknown>): StaffDetailSearch => {
		const tab = search.tab as string
		const validTabs: TabType[] = ["profile", "documents"]

		return {
			tab: validTabs.includes(tab as TabType) ? (tab as TabType) : "profile",
		}
	},
	beforeLoad: async ({ params }: { params: { staffId: string } }) => {
		try {
			const employeeData = await queryClient.fetchQuery({
				queryKey: ["employees", params.staffId],
				queryFn: () => getEmployeeById(params.staffId),
				staleTime: 5 * 60 * 1000,
			})
			const fullName = employeeData ? getEmployeeFullName(employeeData) : null

			return {
				breadcrumb: fullName ?? `Employee ${params.staffId}`,
			}
		} catch {
			return {
				breadcrumb: `Employee ${params.staffId}`,
			}
		}
	},
})

function StaffDetailLayout() {
	const params = Route.useParams()
	const search = Route.useSearch()
	const navigate = useNavigate({ from: Route.fullPath })

	const employeeId = params.staffId
	const tab = search.tab

	const { data: employeeData, isLoading } = useEmployee(employeeId)

	const handleTabChange = useTabNavigation(tab, "profile", navigate)

	const tabsContent = (
		<Tabs
			aria-label="Employee details tabs"
			classNames={{ tabList: "shadow-md" }}
			color="primary"
			onSelectionChange={(key) => handleTabChange(key as TabType)}
			radius="sm"
			selectedKey={tab}
			size="sm"
			variant="solid"
		>
			<Tab key="profile" title="Profile" />
			<Tab key="documents" title="Documents" />
		</Tabs>
	)

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner size="lg" />
			</div>
		)
	}

	return (
		<RouteErrorBoundary routeName="employee-detail">
			<div className="flex min-h-screen flex-col">
				<StaffDetailHeader employeeData={employeeData} tabs={tabsContent} />
				<main className="container mx-auto max-w-4xl flex-1 py-10">
					{tab === "profile" ? (
						<StaffProfileTab employeeData={employeeData} />
					) : (
						<div className="text-center text-neutral-500">Documents tab coming soon</div>
					)}
				</main>
			</div>
		</RouteErrorBoundary>
	)
}
