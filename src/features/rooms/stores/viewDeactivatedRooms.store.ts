import { atomWithStorage, createJSONStorage } from "jotai/utils"

const STORAGE_KEY = "viewDeactivatedRooms"

// Custom storage that reads synchronously on init to avoid hydration mismatch
const storage = createJSONStorage<boolean>(() => localStorage)

// Get initial value synchronously from localStorage to prevent double API calls
const getInitialValue = (): boolean => {
	if (typeof window === "undefined") return false
	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		return stored ? JSON.parse(stored) : false
	} catch {
		return false
	}
}

export const viewDeactivatedRoomsAtom = atomWithStorage<boolean>(STORAGE_KEY, getInitialValue(), storage)
