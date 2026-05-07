import { useTranslation } from "react-i18next"

import { useInfiniteSelectQueryErrorToast } from "./useInfiniteSelectQueryErrorToast"
import { useInfiniteAllStudents, useInfiniteRooms } from "./useRooms"

export const useAddStudentModalStudents = (isOpen: boolean) => {
	const { t } = useTranslation()
	const query = useInfiniteAllStudents(isOpen)

	useInfiniteSelectQueryErrorToast({
		error: query.error,
		isEnabled: isOpen,
		isError: query.isError,
		isFetchNextPageError: query.isFetchNextPageError,
		title: t("rooms.addStudent.loadError"),
	})

	return query
}

export const useTransferStudentRooms = (isOpen: boolean) => {
	const { t } = useTranslation()
	const query = useInfiniteRooms("active", isOpen)

	useInfiniteSelectQueryErrorToast({
		error: query.error,
		isEnabled: isOpen,
		isError: query.isError,
		isFetchNextPageError: query.isFetchNextPageError,
		title: t("rooms.transferStudent.loadError"),
	})

	return query
}
