import { Spinner, Tab, Tabs } from "@heroui/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { RouteErrorBoundary } from "@/components/error"
import StudentDetailHeader from "@/features/students/components/StudentDetailHeader"
import { useStudent } from "@/features/students/hooks/useStudents"
import { getStudentById } from "@/features/students/services/student.service"
import MarkAbsentModal from "@/features/rooms/components/MarkAbsentModal"
import { openMarkAbsentModal } from "@/features/rooms/stores/markAbsentModal.store"
import { openTransferStudentModal } from "@/features/rooms/stores/transferStudentModal.store"
import { useTabNavigation } from "@/hooks/useTabNavigation"
import { queryClient } from "@/services/queryClient"

type TabType = "activity" | "profile" | "documents" | "imunization" | "billing"

interface StudentDetailSearch {
	tab: TabType
}

export const Route = createFileRoute("/_authenticated/students/$studentId")({
	component: StudentDetailPage,
	parseParams: (params) => ({
		studentId: params.studentId,
	}),
	validateSearch: (search: Record<string, unknown>): StudentDetailSearch => {
		const tab = search.tab as string
		const validTabs: TabType[] = ["activity", "profile", "documents", "imunization", "billing"]

		return {
			tab: validTabs.includes(tab as TabType) ? (tab as TabType) : "activity",
		}
	},
	beforeLoad: async ({ params }: { params: { studentId: string } }) => {
		try {
			const student = await queryClient.fetchQuery({
				queryKey: ["students", params.studentId],
				queryFn: () => getStudentById(params.studentId),
				staleTime: 5 * 60 * 1000,
			})

			return {
				breadcrumb: `${student.firstName} ${student.lastName}`,
			}
		} catch {
			return {
				breadcrumb: `Student ${params.studentId}`,
			}
		}
	},
})

function StudentDetailPage() {
	const params = Route.useParams()
	const search = Route.useSearch()
	const navigate = useNavigate({ from: Route.fullPath })
	const { data: student, isError, isLoading } = useStudent(params.studentId)

	const tab = search.tab
	const handleTabChange = useTabNavigation(tab, "activity", navigate)

	const handleMoveStudent = () => {
		if (!student) return
		if (!student.roomId) return
		openTransferStudentModal(student.roomId, [student.id])
	}

	const handleScheduleAbsence = () => {
		if (!student) return
		openMarkAbsentModal(student.id, `${student.firstName} ${student.lastName}`)
	}

	if (isLoading) {
		return (
			<main className="flex min-h-screen items-center justify-center">
				<Spinner size="lg" />
			</main>
		)
	}

	if (isError || !student) {
		return (
			<RouteErrorBoundary routeName="student-detail">
				<main className="container mx-auto max-w-4xl py-10">
					<p className="text-danger">Student not found.</p>
				</main>
			</RouteErrorBoundary>
		)
	}

	return (
		<RouteErrorBoundary routeName="student-detail">
			<div className="flex min-h-screen flex-col">
				<StudentDetailHeader
					onMoveToRoom={student.roomId ? handleMoveStudent : undefined}
					onScheduleAbsence={handleScheduleAbsence}
					student={student}
				/>
				<main className="container mx-auto max-w-4xl flex-1">
					<Tabs
						aria-label="Student details tabs"
						classNames={{ tabList: "shadow-md" }}
						color="primary"
						onSelectionChange={(key) => handleTabChange(key as TabType)}
						radius="sm"
						selectedKey={tab}
						size="sm"
						variant="solid"
					>
						<Tab key="activity" title="Activity" />
						<Tab key="profile" title="Profile" />
						<Tab key="documents" title="Documents" />
						<Tab key="imunization" title="Imunization" />
						<Tab key="billing" title="Billing" />
					</Tabs>

					<div className="mt-6">
						{tab === "activity" && <p className="text-default-500">Activity content coming soon.</p>}
						{tab === "profile" && <p className="text-default-500">Profile content coming soon.</p>}
						{tab === "documents" && <p className="text-default-500">Documents content coming soon.</p>}
						{tab === "imunization" && <p className="text-default-500">Imunization content coming soon.</p>}
						{tab === "billing" && <p className="text-default-500">Billing content coming soon.</p>}
					</div>
				</main>
			</div>
			<MarkAbsentModal />
		</RouteErrorBoundary>
	)
}
