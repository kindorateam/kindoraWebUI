import { Spinner, Tabs } from "@heroui/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { RouteErrorBoundary } from "@/components/error"
import RegeneratePinModal from "@/features/staff/components/RegeneratePinModal"
import StaffDetailHeader from "@/features/staff/components/StaffDetailHeader"
import StaffDocumentsTab from "@/features/staff/components/StaffDocumentsTab"
import StaffProfileTab from "@/features/staff/components/StaffProfileTab"
import { useEmployee } from "@/features/staff/hooks/useStaff"
import { getEmployeeById } from "@/features/staff/services/staff.service"
import { openRegeneratePinModal } from "@/features/staff/stores/regeneratePinModal.store"
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
		<Tabs onSelectionChange={(key) => handleTabChange(key as TabType)} selectedKey={tab}>
			<Tabs.ListContainer>
				<Tabs.List aria-label="Employee details tabs" className="shadow-md">
					<Tabs.Tab id="profile">
						Profile
						<Tabs.Indicator />
					</Tabs.Tab>
					<Tabs.Tab id="documents">
						Documents
						<Tabs.Indicator />
					</Tabs.Tab>
				</Tabs.List>
			</Tabs.ListContainer>
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
				<StaffDetailHeader
					employeeData={employeeData}
					onGeneratePin={openRegeneratePinModal}
					// TODO: Wire to send invite API when available
					onSendInvite={() => {}}
					tabs={tabsContent}
				/>
				<RegeneratePinModal employeeId={employeeId} />
				<main className="container mx-auto max-w-4xl flex-1 py-10">
					{tab === "profile" ? (
						<StaffProfileTab employeeId={employeeId} />
					) : (
						<StaffDocumentsTab employeeId={employeeId} />
					)}
				</main>
			</div>
		</RouteErrorBoundary>
	)
}
