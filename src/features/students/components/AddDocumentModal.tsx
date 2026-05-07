import { useAtomValue } from "jotai"

import AddDocumentModalBase from "@/components/AddDocumentModal"

import { useUploadStudentDocument } from "../hooks/useStudents"
import { closeAddDocumentModal, isAddDocumentModalOpenAtom } from "../stores/addDocumentModal.store"

const DOCUMENT_TYPES = [
	{
		key: "cpr-certification",
		label: "CPR Certification",
		labelKey: "students.detail.documents.types.cprCertification",
	},
	{ key: "background-check", label: "Background Check", labelKey: "students.detail.documents.types.backgroundCheck" },
	{
		key: "covid-19-vaccination",
		label: "COVID-19 Vaccination",
		labelKey: "students.detail.documents.types.covid19Vaccination",
	},
	{ key: "employment-contract", label: "Contract", labelKey: "students.detail.documents.types.contract" },
	{
		key: "tuberculosis-test",
		label: "Tuberculosis Test",
		labelKey: "students.detail.documents.types.tuberculosisTest",
	},
	{ key: "other", label: "Other", labelKey: "students.detail.documents.types.other" },
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
