import { useAtomValue } from "jotai"

import AddDocumentModalBase from "@/components/AddDocumentModal"

import { useUploadStudentDocument } from "../hooks/useStudents"
import { closeAddDocumentModal, isAddDocumentModalOpenAtom } from "../stores/addDocumentModal.store"

const DOCUMENT_TYPES = [
	{ key: "birth_certificate", label: "Birth Certificate" },
	{ key: "emergency_authorization", label: "Emergency Authorization" },
	{ key: "immunization_record", label: "Immunization Record" },
	{ key: "medical_form", label: "Medical Form" },
	{ key: "pickup_authorization", label: "Pickup Authorization" },
]

interface Props {
	studentId: string
}

const AddDocumentModal = ({ studentId }: Props) => {
	const isOpen = useAtomValue(isAddDocumentModalOpenAtom)
	const uploadMutation = useUploadStudentDocument()

	return (
		<AddDocumentModalBase
			isOpen={isOpen}
			onClose={closeAddDocumentModal}
			documentTypes={DOCUMENT_TYPES}
			isPending={uploadMutation.isPending}
			onUpload={(file, data, { onSuccess, onError }) => {
				uploadMutation.mutate({ studentId, file, data }, { onSuccess, onError })
			}}
		/>
	)
}

export default AddDocumentModal
