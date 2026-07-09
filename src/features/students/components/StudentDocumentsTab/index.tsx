import DocumentTable from "@/components/documents/DocumentTable"

import { useStudentDocuments } from "../../hooks/useStudents"
import { openAddDocumentModal } from "../../stores/addDocumentModal.store"
import { openDeleteDocumentModal } from "../../stores/deleteDocumentModal.store"
import AddDocumentModal from "../AddDocumentModal"
import DeleteDocumentModal from "../DeleteDocumentModal"

interface StudentDocumentsTabProps {
	studentId: string
}

const StudentDocumentsTab = ({ studentId }: StudentDocumentsTabProps) => {
	const { data: documents = [], isLoading, error, refetch } = useStudentDocuments(studentId)

	return (
		<>
			<DocumentTable
				documents={documents}
				error={error}
				isLoading={isLoading}
				onAdd={openAddDocumentModal}
				onDelete={openDeleteDocumentModal}
				onRetry={() => void refetch()}
				translationScope="students.detail.documents"
			/>
			<AddDocumentModal studentId={studentId} />
			<DeleteDocumentModal studentId={studentId} />
		</>
	)
}

export default StudentDocumentsTab
