import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"

import AddDocumentModalBase from "@/components/AddDocumentModal"

import { useUploadEmployeeDocument } from "../hooks/useStaff"
import { closeAddDocumentModal, isAddDocumentModalOpenAtom } from "../stores/addDocumentModal.store"

const DOCUMENT_TYPES = [
	{ key: "background_check", labelKey: "staff.documents.types.backgroundCheck" },
	{ key: "covid_vaccination", labelKey: "staff.documents.types.covidVaccination" },
	{ key: "cpr_certification", labelKey: "staff.documents.types.cprCertification" },
	{ key: "employment_contract", labelKey: "staff.documents.types.employmentContract" },
	{ key: "tuberculosis_test", labelKey: "staff.documents.types.tuberculosisTest" },
]

interface Props {
	employeeId: string
}

const AddDocumentModal = ({ employeeId }: Props) => {
	const { t } = useTranslation()
	const isOpen = useAtomValue(isAddDocumentModalOpenAtom)
	const uploadMutation = useUploadEmployeeDocument()
	const documentTypes = DOCUMENT_TYPES.map((type) => ({
		key: type.key,
		label: t(type.labelKey),
	}))

	return (
		<AddDocumentModalBase
			isOpen={isOpen}
			onClose={closeAddDocumentModal}
			documentTypes={documentTypes}
			isPending={uploadMutation.isPending}
			onUpload={(file, data, { onSuccess, onError }) => {
				uploadMutation.mutate({ employeeId, file, data }, { onSuccess, onError })
			}}
		/>
	)
}

export default AddDocumentModal
