import DocumentTable from "@/components/documents/DocumentTable"

import { useEmployeeDocuments } from "../../hooks/useStaff"
import { openAddDocumentModal } from "../../stores/addDocumentModal.store"
import { openDeleteDocumentModal } from "../../stores/deleteDocumentModal.store"
import AddDocumentModal from "../AddDocumentModal"
import DeleteDocumentModal from "../DeleteDocumentModal"

interface StaffDocumentsTabProps {
	employeeId: string
}

const StaffDocumentsTab = ({ employeeId }: StaffDocumentsTabProps) => {
	const { data: documents = [], isLoading, error, refetch } = useEmployeeDocuments(employeeId)

	return (
		<>
			<DocumentTable
				documents={documents}
				error={error}
				isLoading={isLoading}
				onAdd={openAddDocumentModal}
				onDelete={openDeleteDocumentModal}
				onRetry={() => void refetch()}
				translationScope="staff.documents"
			/>
			<AddDocumentModal employeeId={employeeId} />
			<DeleteDocumentModal employeeId={employeeId} />
		</>
	)
}

export default StaffDocumentsTab
