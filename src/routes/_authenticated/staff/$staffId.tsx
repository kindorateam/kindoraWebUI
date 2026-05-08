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
import { queryClient } from "@/services/queryClient"
import { useBreadcrumbOverride } from "@/stores/breadcrumb.store"

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
	beforeLoad: () => ({ breadcrumbKey: "staff.title" }),
	loader: ({ params }: { params: { staffId: string } }) => {
		queryClient.ensureQueryData({
			queryKey: ["employees", params.staffId],
			queryFn: () => getEmployeeById(params.staffId),
			staleTime: 5 * 60 * 1000,
		})
	},
})

function StaffDetailLayout() {
	const params = Route.useParams()
	const search = Route.useSearch()
	const navigate = useNavigate({ from: Route.fullPath })

	const employeeId = params.staffId
	const tab = search.tab

	const { data: employeeData } = useEmployee(employeeId)
	useBreadcrumbOverride(employeeData ? getEmployeeFullName(employeeData) : undefined)

	const handleTabChange = (newTab: TabType) => {
		void navigate({
			search: (prev) => ({ ...prev, tab: newTab }),
			replace: true,
		})
	}

	return (
		<RouteErrorBoundary routeName="employee-detail">
			<div>
				<StaffDetailHeader
					employeeData={employeeData}
					activeTab={tab}
					onTabChange={handleTabChange}
					onGeneratePin={openRegeneratePinModal}
					// TODO: Wire to send invite API when available
					onSendInvite={() => {}}
				/>
				<RegeneratePinModal employeeId={employeeId} />
				<main className="container mx-auto max-w-4xl pt-5">
					{tab === "profile" && <StaffProfileTab employeeId={employeeId} />}
					{tab === "documents" && <StaffDocumentsTab employeeId={employeeId} />}
				</main>
			</div>
		</RouteErrorBoundary>
	)
}
