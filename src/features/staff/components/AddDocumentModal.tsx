import { useAtomValue } from "jotai"

import AddDocumentModalBase from "@/components/AddDocumentModal"

import { useUploadEmployeeDocument } from "../hooks/useStaff"
import { closeAddDocumentModal, isAddDocumentModalOpenAtom } from "../stores/addDocumentModal.store"

const DOCUMENT_TYPES = [
	{ key: "background_check", label: "Background Check" },
	{ key: "covid_vaccination", label: "Covid-19 Vaccination" },
	{ key: "cpr_certification", label: "CPR Certification" },
	{ key: "employment_contract", label: "Employment Contract" },
	{ key: "tuberculosis_test", label: "Tuberculosis Test" },
]

interface Props {
	employeeId: string
}

const AddDocumentModal = ({ employeeId }: Props) => {
	const isOpen = useAtomValue(isAddDocumentModalOpenAtom)
	const uploadMutation = useUploadEmployeeDocument()

	return (
		<AddDocumentModalBase
			isOpen={isOpen}
			onClose={closeAddDocumentModal}
			documentTypes={DOCUMENT_TYPES}
			isPending={uploadMutation.isPending}
			onUpload={(file, data, { onSuccess, onError }) => {
				uploadMutation.mutate({ employeeId, file, data }, { onSuccess, onError })
			}}
		/>
	)
}

export default AddDocumentModal
