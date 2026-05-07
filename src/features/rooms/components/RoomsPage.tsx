import { useTranslation } from "react-i18next"

import AddRoomModal from "./AddRoomModal"
import DeactivateRoomModal from "./DeactivateRoomModal"
import RoomsTable from "./RoomsTable"

export default function RoomsPage() {
	const { t } = useTranslation()

	return (
		<>
			<main className="container mx-auto max-w-4xl">
				<h1 className="mb-8 font-semibold text-4xl">{t("rooms.title")}</h1>
				<RoomsTable />
			</main>
			<AddRoomModal />
			<DeactivateRoomModal />
		</>
	)
}
