import { useInfiniteSelectQueryErrorToast } from "./useInfiniteSelectQueryErrorToast"
import { useInfiniteAllStudents, useInfiniteRooms } from "./useRooms"

export const useAddStudentModalStudents = (isOpen: boolean) => {
	const query = useInfiniteAllStudents(isOpen)

	useInfiniteSelectQueryErrorToast({
		error: query.error,
		isEnabled: isOpen,
		isError: query.isError,
		isFetchNextPageError: query.isFetchNextPageError,
		title: "Failed to load students",
	})

	return query
}

export const useTransferStudentRooms = (isOpen: boolean) => {
	const query = useInfiniteRooms("active", isOpen)

	useInfiniteSelectQueryErrorToast({
		error: query.error,
		isEnabled: isOpen,
		isError: query.isError,
		isFetchNextPageError: query.isFetchNextPageError,
		title: "Failed to load rooms",
	})

	return query
}
