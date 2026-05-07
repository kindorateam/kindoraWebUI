import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { RouteErrorBoundary } from "@/components/error"
import MarkAbsentModal from "@/features/rooms/components/MarkAbsentModal"
import { openMarkAbsentModal } from "@/features/rooms/stores/markAbsentModal.store"
import { openTransferStudentModal } from "@/features/rooms/stores/transferStudentModal.store"
import StudentDetailHeader from "@/features/students/components/StudentDetailHeader"
import StudentDocumentsTab from "@/features/students/components/StudentDocumentsTab"
import StudentProfileTab from "@/features/students/components/StudentProfileTab"
import { useStudent } from "@/features/students/hooks/useStudents"
import { getStudentById } from "@/features/students/services/student.service"
import { queryClient } from "@/services/queryClient"
import { useBreadcrumbOverride } from "@/stores/breadcrumb.store"

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
	beforeLoad: () => ({ breadcrumbKey: "students.title" }),
	loader: ({ params }: { params: { studentId: string } }) => {
		queryClient.ensureQueryData({
			queryKey: ["students", params.studentId],
			queryFn: () => getStudentById(params.studentId),
			staleTime: 5 * 60 * 1000,
		})
	},
})

function StudentDetailPage() {
	const { t } = useTranslation()
	const params = Route.useParams()
	const search = Route.useSearch()
	const navigate = useNavigate({ from: Route.fullPath })
	const { data: student, isError, isLoading } = useStudent(params.studentId)
	useBreadcrumbOverride(student ? `${student.firstName} ${student.lastName}` : undefined)

	const tab = search.tab
	const handleTabChange = (newTab: TabType) => {
		void navigate({ search: (prev) => ({ ...prev, tab: newTab }), replace: true })
	}

	const handleMoveStudent = () => {
		if (!student) return
		if (!student.roomId) return
		openTransferStudentModal(student.roomId, [student.id])
	}

	const handleScheduleAbsence = () => {
		if (!student) return
		openMarkAbsentModal(student.id, `${student.firstName} ${student.lastName}`)
	}

	if (isLoading || isError || !student) {
		return (
			<RouteErrorBoundary routeName="student-detail">
				<main className="container mx-auto max-w-4xl py-10">
					<p className="text-danger">{t("students.detail.notFound")}</p>
				</main>
			</RouteErrorBoundary>
		)
	}

	return (
		<RouteErrorBoundary routeName="student-detail">
			<div>
				<StudentDetailHeader
					student={student}
					activeTab={tab}
					onTabChange={handleTabChange}
					onMoveToRoom={student.roomId ? handleMoveStudent : undefined}
					onScheduleAbsence={handleScheduleAbsence}
				/>
				<main className="container mx-auto max-w-4xl flex-1 pt-5">
					{tab === "activity" && <p className="text-default-500">{t("students.detail.activityComingSoon")}</p>}
					{tab === "profile" && <StudentProfileTab student={student} />}
					{tab === "documents" && <StudentDocumentsTab studentId={student.id} />}
					{tab === "imunization" && <p className="text-default-500">{t("students.detail.immunizationComingSoon")}</p>}
					{tab === "billing" && <p className="text-default-500">{t("students.detail.billingComingSoon")}</p>}
				</main>
			</div>
			<MarkAbsentModal />
		</RouteErrorBoundary>
	)
}
