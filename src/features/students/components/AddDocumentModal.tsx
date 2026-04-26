import { useAtomValue } from "jotai"

import AddDocumentModalBase from "@/components/AddDocumentModal"

import { useUploadStudentDocument } from "../hooks/useStudents"
import { closeAddDocumentModal, isAddDocumentModalOpenAtom } from "../stores/addDocumentModal.store"

const DOCUMENT_TYPES = [
	{ key: "cpr-certification", label: "CPR Certification" },
	{ key: "background-check", label: "Background Check" },
	{ key: "covid-19-vaccination", label: "COVID-19 Vaccination" },
	{ key: "employment-contract", label: "Contract" },
	{ key: "tuberculosis-test", label: "Tuberculosis Test" },
	{ key: "other", label: "Other" },
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
