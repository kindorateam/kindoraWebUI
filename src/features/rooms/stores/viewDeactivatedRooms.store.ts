import { atomWithStorage } from "jotai/utils"

const STORAGE_KEY = "viewDeactivatedRooms"

export const viewDeactivatedRoomsAtom = atomWithStorage<boolean>(STORAGE_KEY, false, undefined, { getOnInit: true })
